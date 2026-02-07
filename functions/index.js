const {onRequest} = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const crypto = require('crypto');
const axios = require('axios');

admin.initializeApp();
const db = admin.firestore();

const GRAPH_API_VERSION = 'v18.0';
const GRAPH_API_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

// Version: 1.1

async function saveCommentLog(userId, commentText, postId, timestamp) {
  try {
    await db.collection('comments').add({
      userId,
      commentText,
      postId,
      timestamp: timestamp || admin.firestore.FieldValue.serverTimestamp(),
      responded: true
    });
    console.log('💾 Comment log saved');
  } catch (error) {
    console.error('❌ Error saving comment log:', error);
  }
}

async function saveUserInfo(userId, userInfo) {
  try {
    await db.collection('users').doc(userId).set({
      ...userInfo,
      lastInteraction: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log('💾 User info saved');
  } catch (error) {
    console.error('❌ Error saving user info:', error);
  }
}

async function hasUserResponded(userId, postId) {
  try {
    const snapshot = await db.collection('comments')
      .where('userId', '==', userId)
      .where('postId', '==', postId)
      .where('responded', '==', true)
      .get();
    return !snapshot.empty;
  } catch (error) {
    console.error('❌ Error checking user response:', error);
    return false;
  }
}

async function hasUserCommented(userId, postId = null) {
  try {
    let query = db.collection('comments')
      .where('userId', '==', userId);
    
    if (postId) {
      query = query.where('postId', '==', postId);
    }
    
    const snapshot = await query.get();
    console.log(`🔍 [hasUserCommented] User ${userId} has ${snapshot.size} comment(s)`);
    return !snapshot.empty;
  } catch (error) {
    console.error('❌ Error checking user comment:', error);
    return false;
  }
}

async function getUserClaimCount(userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      const claimCount = userDoc.data().claimCount || 0;
      console.log(`🔍 [getUserClaimCount] User ${userId} has claimed ${claimCount} times`);
      return claimCount;
    }
    console.log(`🔍 [getUserClaimCount] User ${userId} has never claimed`);
    return 0;
  } catch (error) {
    console.error('❌ Error getting user claim count:', error);
    return 0;
  }
}

async function incrementUserClaimCount(userId) {
  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      const currentCount = userDoc.data().claimCount || 0;
      await userRef.update({
        claimCount: currentCount + 1,
        lastClaimTime: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✅ [incrementUserClaimCount] User ${userId} claim count: ${currentCount} → ${currentCount + 1}`);
    } else {
      await userRef.set({
        claimCount: 1,
        lastClaimTime: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✅ [incrementUserClaimCount] User ${userId} first claim recorded`);
    }
  } catch (error) {
    console.error('❌ Error incrementing user claim count:', error);
  }
}

async function sendImage(recipientId, imageUrl, pageAccessToken, pageId) {
  console.log('🔵 [sendImage] START', {
    recipientId,
    imageUrl: imageUrl.substring(0, 50) + '...',
    hasToken: !!pageAccessToken,
    tokenPrefix: pageAccessToken?.substring(0, 20) + '...'
  });
  
  try {
    const messageData = {
      recipient: { id: recipientId },
      message: {
        attachment: {
          type: 'image',
          payload: { url: imageUrl, is_reusable: true }
        }
      }
    };
    
    console.log('🔵 [sendImage] Sending request to:', `${GRAPH_API_URL}/me/messages`);
    
    const response = await axios.post(`${GRAPH_API_URL}/me/messages`, messageData, { 
      headers: {
        'Authorization': `Bearer ${pageAccessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ [sendImage] SUCCESS:', response.data);
  } catch (error) {
    console.error('❌ [sendImage] FAILED:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
}

async function sendTextMessage(recipientId, text, pageAccessToken) {
  console.log('🟢 [sendTextMessage] START', {
    recipientId,
    text,
    hasToken: !!pageAccessToken,
    tokenPrefix: pageAccessToken?.substring(0, 20) + '...'
  });
  
  try {
    const messageData = {
      recipient: { id: recipientId },
      message: { text: text }
    };
    
    console.log('🟢 [sendTextMessage] Sending request to:', `${GRAPH_API_URL}/me/messages`);
    
    const response = await axios.post(`${GRAPH_API_URL}/me/messages`, messageData, { 
      headers: {
        'Authorization': `Bearer ${pageAccessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ [sendTextMessage] SUCCESS:', response.data);
  } catch (error) {
    console.error('❌ [sendTextMessage] FAILED:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
}

async function replyToComment(commentId, message, pageAccessToken) {
  console.log('🟠 [replyToComment] START', {
    commentId,
    message: message.substring(0, 50) + '...',
    hasToken: !!pageAccessToken
  });
  
  try {
    const response = await axios.post(
      `${GRAPH_API_URL}/${commentId}/comments`,
      { message: message },
      { 
        headers: {
          'Authorization': `Bearer ${pageAccessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ [replyToComment] SUCCESS:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [replyToComment] FAILED:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
}

async function sendImages(recipientId, imageUrls, pageAccessToken, pageId) {
  console.log('🟡 [sendImages] START', {
    recipientId,
    imageUrlsCount: imageUrls?.length || 0,
    imageUrls: imageUrls,
    hasToken: !!pageAccessToken
  });
  
  if (!imageUrls || imageUrls.length === 0) {
    console.log('⚠️ [sendImages] No image URLs, sending fallback message');
    await sendTextMessage(recipientId, '這是國王的照片✨', pageAccessToken);
    return;
  }

  try {
    // 1. 先發送提示文字
    console.log('🟡 [sendImages] Sending initial message...');
    await sendTextMessage(recipientId, '小編生成圖片中...😄✨', pageAccessToken);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // 2. 發送每張圖片，每張都帶說明文字
    for (let i = 0; i < imageUrls.length; i++) {
      console.log(`🟡 [sendImages] Sending image ${i + 1}/${imageUrls.length}`);
      
      // 先發文字說明
      const imageText = `這是第${i === 0 ? '一' : '二'}張圖片：`;
      await sendTextMessage(recipientId, imageText, pageAccessToken);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // 再發圖片
      await sendImage(recipientId, imageUrls[i], pageAccessToken, pageId);
      
      if (i < imageUrls.length - 1) {
        console.log('🟡 [sendImages] Waiting between images...');
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    console.log('✅ [sendImages] All images sent successfully');
  } catch (error) {
    console.error('⚠️ [sendImages] Error, sending fallback message:', error);
    await sendTextMessage(recipientId, '這是國王的照片✨', pageAccessToken);
  }
}

async function handleMessage(event, imageUrls, pageAccessToken, pageId) {
  console.log('🟣 [handleMessage] START');
  console.log('🟣 [handleMessage] Event:', JSON.stringify(event, null, 2));
  
  const senderId = event.sender.id;
  const messageText = event.message?.text || '';
  const postId = event.postId;
  const commentId = event.commentId;
  const senderName = event.senderName || 'User';
  const isComment = !!commentId; // 是否為留言（而非私訊）
  
  console.log('🟣 [handleMessage] Extracted data:', {
    senderId,
    messageText,
    postId,
    commentId,
    senderName,
    isComment,
    imageUrlsCount: imageUrls?.length,
    hasToken: !!pageAccessToken,
    pageId
  });
  
  try {
    // 如果是私訊（不是留言），檢查用戶是否曾經留言過
    if (!isComment) {
      console.log('🟣 [handleMessage] This is a private message, checking if user has commented before...');
      const hasCommented = await hasUserCommented(senderId);
      
      if (!hasCommented) {
        console.log('⚠️ [handleMessage] User has not commented on any post, rejecting');
        await sendTextMessage(
          senderId, 
          '❌ 抱歉，您需要先在粉專的抽獎貼文下方留言（例如：+1、抽獎），才能領取圖片喔！✨',
          pageAccessToken
        );
        return;
      }
      console.log('✅ [handleMessage] User has commented before, proceeding...');
      
      // 檢查用戶領取次數
      console.log('🟣 [handleMessage] Checking user claim count...');
      const claimCount = await getUserClaimCount(senderId);
      console.log(`📊 [handleMessage] User current claim count: ${claimCount}`);
      
      if (claimCount >= 2) {
        console.log('⚠️ [handleMessage] User has already claimed 2 times, rejecting');
        await sendTextMessage(
          senderId,
          '❌ 您已經領取過兩次了，無法再領取囉！感謝您的支持 💖',
          pageAccessToken
        );
        return;
      }
      console.log('✅ [handleMessage] User can still claim (count < 2), proceeding...');
    }
    
    // 如果是留言，檢查是否已經回應過
    if (postId) {
      console.log('🟣 [handleMessage] Checking if user already responded...');
      const responded = await hasUserResponded(senderId, postId);
      if (responded) {
        console.log('ℹ️ [handleMessage] User already responded, skipping');
        return;
      }
      console.log('🟣 [handleMessage] User has not responded yet');
    }
    
    if (postId) {
      console.log('🟣 [handleMessage] Saving comment log...');
      await saveCommentLog(senderId, messageText, postId, new Date());
    }
    
    console.log('🟣 [handleMessage] Saving user info...');
    await saveUserInfo(senderId, { name: senderName, lastMessage: messageText });
    
    // 嘗試發送私訊
    console.log('🟣 [handleMessage] Attempting to send private message...');
    let privateMessageSent = false;
    
    try {
      await sendImages(senderId, imageUrls, pageAccessToken, pageId);
      console.log('✅ [handleMessage] Private message sent successfully!');
      
      // 私訊發送成功後，增加領取次數計數（只在非留言的情況下）
      if (!isComment) {
        console.log('🟣 [handleMessage] Incrementing user claim count...');
        await incrementUserClaimCount(senderId);
        console.log('✅ [handleMessage] User claim count incremented');
      }
      privateMessageSent = true;
      
      // 私訊成功，如果是留言則簡單提示已私訊
      if (isComment && commentId) {
        try {
          const successMessage = `${senderName} 您好！✨ 已私訊您抽獎圖片囉！請到私訊查看 😊`;
          await replyToComment(commentId, successMessage, pageAccessToken);
          console.log('✅ [handleMessage] Public notification sent');
        } catch (error) {
          console.error('❌ [handleMessage] Failed to send public notification:', error);
        }
      }
    } catch (error) {
      console.log('⚠️ [handleMessage] Cannot send private message (user has not messaged page before)');
      console.log('ℹ️ [handleMessage] Error:', error.response?.data || error.message);
      
      // 私訊失敗，如果是留言則引導用戶先私訊（不暴露圖片連結）
      if (isComment && commentId) {
        try {
          const guideMessage = `${senderName} 您好！🎉\n\n` +
            `感謝您參加抽獎活動！✨\n\n` +
            `📩 為了保護您的隱私，請先私訊我們的粉專「領取」或「+1」，\n` +
            `我們就能立即將抽獎圖片私訊給您囉！💌\n\n` +
            `� 點擊粉專頭像 → 「傳送訊息」即可開始私訊！`;
          
          await replyToComment(commentId, guideMessage, pageAccessToken);
          console.log('✅ [handleMessage] Guide message sent to prompt user to DM');
        } catch (replyError) {
          console.error('❌ [handleMessage] Failed to reply to comment:', replyError);
        }
      } else {
        // 不是留言（是私訊），但發送失敗（不應該發生，但記錄一下）
        console.error('❌ [handleMessage] Private message failed for a non-comment event');
      }
    }
    
    console.log('✅ [handleMessage] Handling complete!');
  } catch (error) {
    console.error('❌ [handleMessage] Error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
  }
}

function handlePrivacyPolicy(req, res) {
  res.send(`<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>隱私政策</title>
<style>
body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
h1 { color: #1877f2; }
h2 { margin-top: 30px; }
</style>
</head>
<body>
<h1>隱私政策</h1>
<p>最後更新：2025年10月23日</p>
<h2>1. 資料收集</h2>
<p>我們收集您的 Facebook 用戶 ID、留言內容和留言時間。</p>
<h2>2. 資料使用</h2>
<p>用於自動回覆和活動管理。</p>
<h2>3. 資料安全</h2>
<p>資料安全存儲在 Firebase Firestore。</p>
<h2>4. 您的權利</h2>
<p>您可以隨時要求刪除您的資料。</p>
</body>
</html>`);
}

function handleDataDeletion(req, res) {
  if (req.method === 'POST') {
    try {
      const signedRequest = req.body.signed_request;
      if (!signedRequest) {
        return res.status(400).json({ error: 'Missing signed_request' });
      }
      
      const [encodedSig, payload] = signedRequest.split('.');
      const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
      const userId = data.user_id;
      
      console.log(`📋 Data deletion request for user: ${userId}`);
      
      const confirmationCode = crypto.randomBytes(16).toString('hex');
      
      db.collection('deletion_requests').add({
        userId,
        confirmationCode,
        status: 'pending',
        requestTime: admin.firestore.FieldValue.serverTimestamp()
      }).catch(err => console.error('Error:', err));
      
      res.json({
        url: `https://asia-east1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/bot/deletion/status?id=${confirmationCode}`,
        confirmation_code: confirmationCode
      });
    } catch (error) {
      console.error('❌ Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    const confirmationCode = req.query.id;
    res.send(`<html><body><h1>資料刪除請求</h1><p>確認碼: ${confirmationCode || 'N/A'}</p><p>狀態: 已完成</p></body></html>`);
  } else {
    res.sendStatus(405);
  }
}

async function handleWebhook(req, res, pageAccessToken, verifyToken, commentKeywords, messageKeywords, imageUrls, targetPostIds, pageId) {
  console.log('🔷 [handleWebhook] Entering webhook handler');
  console.log('🔷 [handleWebhook] Parameters:', {
    method: req.method,
    hasToken: !!pageAccessToken,
    tokenPrefix: pageAccessToken?.substring(0, 30) + '...',
    commentKeywords,
    messageKeywords,
    imageUrlsCount: imageUrls.length,
    pageId
  });
  
  if (req.method === 'GET') {
    console.log('🔷 [handleWebhook] GET request - webhook verification');
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    console.log('🔷 [handleWebhook] Verification params:', { mode, token, challenge });
    
    if (mode && token) {
      if (mode === 'subscribe' && token === verifyToken) {
        console.log('✅ [handleWebhook] Webhook verified successfully');
        res.status(200).send(challenge);
      } else {
        console.log('❌ [handleWebhook] Invalid token');
        res.sendStatus(403);
      }
    } else {
      console.log('❌ [handleWebhook] Missing mode or token');
      res.sendStatus(400);
    }
    return;
  }
  
  if (req.method === 'POST') {
    console.log('🔷 [handleWebhook] POST request - processing webhook event');
    const body = req.body;
    
    console.log('🔷 [handleWebhook] Body object type:', body.object);
    
    if (body.object === 'page') {
      console.log('🔷 [handleWebhook] Page object confirmed, entries count:', body.entry?.length);
      
      for (let i = 0; i < body.entry.length; i++) {
        const entry = body.entry[i];
        console.log(`🔷 [handleWebhook] Processing entry ${i + 1}/${body.entry.length}`);
        console.log('🔷 [handleWebhook] Entry structure:', {
          hasChanges: !!entry.changes,
          hasMessaging: !!entry.messaging,
          changesCount: entry.changes?.length,
          messagingCount: entry.messaging?.length
        });
        
        if (entry.changes) {
          console.log('🔷 [handleWebhook] Processing comment changes...');
          handleCommentEvent(entry.changes, pageAccessToken, commentKeywords, imageUrls, targetPostIds, pageId);
        } else if (entry.messaging) {
          console.log('🔷 [handleWebhook] Processing messaging events...');
          for (let j = 0; j < entry.messaging.length; j++) {
            const event = entry.messaging[j];
            console.log(`🔷 [handleWebhook] Processing message ${j + 1}/${entry.messaging.length}`);
            console.log('🔷 [handleWebhook] Event:', JSON.stringify(event, null, 2));
            
            // 處理私訊事件
            if (event.message && event.message.text) {
              const messageText = event.message.text;
              console.log(`💬 [handleWebhook] Private message received: "${messageText}"`);
              console.log(`💬 [handleWebhook] Sender ID: ${event.sender?.id}`);
              
              // 檢查是否包含私訊關鍵字
              console.log(`💬 [handleWebhook] Checking message keywords: ${messageKeywords.join(', ')}`);
              const matchedKeyword = messageKeywords.find(keyword => messageText.includes(keyword));
              
              if (matchedKeyword) {
                console.log(`✅ [handleWebhook] Keyword matched: "${matchedKeyword}"`);
                console.log('✅ [handleWebhook] Calling handleMessage...');
                await handleMessage(event, imageUrls, pageAccessToken, pageId);
                console.log('✅ [handleWebhook] handleMessage completed');
              } else {
                console.log(`ℹ️ [handleWebhook] No keyword match. Message: "${messageText}"`);
                console.log(`ℹ️ [handleWebhook] Available keywords: ${messageKeywords.join(', ')}`);
              }
            } else {
              console.log('ℹ️ [handleWebhook] Event has no text message:', {
                hasMessage: !!event.message,
                hasText: !!event.message?.text,
                messageKeys: event.message ? Object.keys(event.message) : []
              });
            }
          }
        }
      }
      console.log('✅ [handleWebhook] All events processed, sending response');
      res.status(200).send('EVENT_RECEIVED');
    } else {
      console.log('❌ [handleWebhook] Not a page object:', body.object);
      res.sendStatus(404);
    }
    return;
  }
  
  res.send('Facebook Bot is running on Firebase! 🤖🔥');
}

function handleCommentEvent(changes, pageAccessToken, keywords, imageUrls, targetPostIds, pageId) {
  changes.forEach(change => {
    if (change.field === 'feed') {
      const value = change.value;
      
      if (value.item === 'comment' && value.verb === 'add' && value.message) {
        const commentText = value.message;
        const postId = value.post_id;
        const commentId = value.comment_id;
        const senderId = value.from.id;
        const senderName = value.from.name;
        
        console.log(`💬 New comment: ${senderName} - ${commentText}`);
        console.log(`💬 Comment ID: ${commentId}`);
        
        // 忽略粉專自己的留言，避免無限迴圈
        if (senderId === pageId) {
          console.log('⏭️  Skipping - comment from page itself');
          return;
        }
        
        if (targetPostIds.length > 0 && !targetPostIds.includes(postId)) {
          console.log('⏭️  Skipping - not in target list');
          return;
        }
        
        const hasKeyword = keywords.some(keyword => commentText.includes(keyword));
        
        if (hasKeyword) {
          console.log('✅ Keyword matched!');
          handleMessage({
            sender: { id: senderId },
            message: { text: commentText },
            postId: postId,
            commentId: commentId,
            senderName: senderName
          }, imageUrls, pageAccessToken, pageId);
        } else {
          console.log(`ℹ️  No keyword match. Keywords: ${keywords.join(', ')}`);
        }
      }
    }
  });
}

async function mainHandler(req, res) {
  console.log('\n🚀🚀🚀 === NEW REQUEST RECEIVED ===');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🌐 Method:', req.method);
  console.log('🛣️  Path:', req.path);
  console.log('📨 Body:', JSON.stringify(req.body, null, 2));
  
  const path = req.path;
  
  if (path === '/privacy' || path === '/privacy/policy') {
    console.log('➡️  Routing to privacy policy handler');
    return handlePrivacyPolicy(req, res);
  }
  
  if (path === '/deletion' || path.startsWith('/deletion')) {
    console.log('➡️  Routing to data deletion handler');
    return handleDataDeletion(req, res);
  }
  
  console.log('➡️  Routing to webhook handler');
  
  // 先從 Firestore 讀取配置
  console.log('🔧 [CONFIG] Loading configuration from Firestore...');
  // 預設關鍵字
  const defaultCommentKeywords = ['抽獎', '參加', '+1', '我要'];
  const defaultMessageKeywords = ['領取'];
  
  let commentKeywords = defaultCommentKeywords;  // 留言關鍵字
  let messageKeywords = defaultMessageKeywords;  // 私訊關鍵字
  let imageUrls = [
    'https://firebasestorage.googleapis.com/v0/b/fanbot-b8f92.firebasestorage.app/o/1.png?alt=media&token=51161d7e-2d3d-4633-b232-07b202a49643',
    'https://firebasestorage.googleapis.com/v0/b/fanbot-b8f92.firebasestorage.app/o/2.png?alt=media&token=5d7b93ef-ee45-4992-a9b3-5fdcafff059b'
  ];
  let targetPostIds = [];
  
  try {
    const configDoc = await admin.firestore().collection('config').doc('bot').get();
    if (configDoc.exists) {
      const configData = configDoc.data();
      console.log('✅ [CONFIG] Loaded from Firestore:', configData);
      
      // 留言關鍵字：如果有設定且不為空，則完全取代預設值
      if (configData.commentKeywords && Array.isArray(configData.commentKeywords) && configData.commentKeywords.length > 0) {
        commentKeywords = configData.commentKeywords.filter(kw => kw.trim());
        console.log('✅ [CONFIG] Using custom comment keywords (replacing defaults)');
      } else {
        console.log('ℹ️ [CONFIG] Using default comment keywords');
      }
      
      // 私訊關鍵字：如果有設定且不為空，則完全取代預設值
      if (configData.messageKeywords && Array.isArray(configData.messageKeywords) && configData.messageKeywords.length > 0) {
        messageKeywords = configData.messageKeywords.filter(kw => kw.trim());
        console.log('✅ [CONFIG] Using custom message keywords (replacing defaults)');
      } else {
        console.log('ℹ️ [CONFIG] Using default message keywords');
      }
      
      if (configData.imageUrls && Array.isArray(configData.imageUrls)) {
        imageUrls = configData.imageUrls.filter(url => url);
      }
      if (configData.targetPostIds && Array.isArray(configData.targetPostIds)) {
        targetPostIds = configData.targetPostIds.filter(id => id);
      }
    } else {
      console.log('⚠️ [CONFIG] No Firestore config found, using defaults');
    }
  } catch (error) {
    console.error('❌ [CONFIG] Failed to load from Firestore:', error);
    console.log('⚠️ [CONFIG] Using default configuration');
  }
  
  const pageAccessToken = 'EAATMnASMNEsBP0ZBeIDKeO2DwtyzCk9yxyEu7ZAh18crGh59ONAePCw8YQK9KmtPEBpMOJShK72g8BEilGoxP1oUtef14orZACLdyZBrPKI232sFTCsebZC1sv6zZBAwUw4MgGHBjVtZBzoXuC2pZBPvPBDh4r59pjtUWGxyWv00aXr7L6n7ObXVcFHOnABod7aSqtUWiwZDZD';
  const verifyToken = 'my_verify_token_123';
  const pageId = '261205178149570';
  
  console.log('✅ [CONFIG] Final configuration:', {
    pageAccessToken: pageAccessToken.substring(0, 30) + '...',
    hasToken: !!pageAccessToken,
    tokenLength: pageAccessToken?.length,
    verifyToken,
    commentKeywords,
    messageKeywords,
    imageUrlsCount: imageUrls.length,
    imageUrls,
    targetPostIdsCount: targetPostIds.length,
    targetPostIds,
    pageId
  });
  
  return handleWebhook(req, res, pageAccessToken, verifyToken, commentKeywords, messageKeywords, imageUrls, targetPostIds, pageId);
}

exports.bot = onRequest({ region: 'asia-east1', timeoutSeconds: 60, memory: '256MiB' }, mainHandler);
