const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { handleMessage } = require('../services/messageHandler');

/**
 * Facebook Webhook 驗證端點
 * Facebook 會在設定 Webhook 時呼叫此端點進行驗證
 */
router.get('/', (req, res) => {
  const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN;
  
  console.log('📥 Webhook verification request received');
  console.log('Query params:', req.query);
  
  // 解析查詢參數
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  // 檢查模式和驗證權杖是否正確
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verified successfully!');
      res.status(200).send(challenge);
    } else {
      console.log('❌ Webhook verification failed - Invalid token');
      console.log(`Expected: ${VERIFY_TOKEN}, Received: ${token}`);
      res.sendStatus(403);
    }
  } else {
    console.log('❌ Webhook verification failed - Missing parameters');
    res.sendStatus(400);
  }
});

/**
 * Facebook Webhook 接收事件端點
 * Facebook 會將所有事件（留言、訊息等）發送到此端點
 */
router.post('/', (req, res) => {
  const body = req.body;
  
  // 驗證請求來自 Facebook
  if (!verifyRequestSignature(req, req.rawBody)) {
    console.error('❌ Invalid request signature');
    return res.sendStatus(403);
  }
  
  // 確認這是一個頁面事件
  if (body.object === 'page') {
    // 遍歷每個入口
    body.entry.forEach(entry => {
      // 取得 Webhook 事件
      const webhookEvent = entry.changes ? entry.changes[0] : entry.messaging[0];
      
      if (entry.changes) {
        // 處理留言事件
        handleCommentEvent(entry.changes);
      } else if (entry.messaging) {
        // 處理訊息事件（如果需要）
        entry.messaging.forEach(event => {
          handleMessage(event);
        });
      }
    });
    
    // 必須在 20 秒內回傳 200 狀態碼
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

/**
 * 處理留言事件
 */
function handleCommentEvent(changes) {
  changes.forEach(change => {
    if (change.field === 'feed') {
      const value = change.value;
      
      // 檢查是否為新增留言且有留言文字
      if (value.item === 'comment' && value.verb === 'add' && value.message) {
        const commentText = value.message;
        const commentId = value.comment_id;
        const postId = value.post_id;
        const senderId = value.from.id;
        const senderName = value.from.name;
        
        console.log(`\n💬 New comment received:`);
        console.log(`   User: ${senderName} (${senderId})`);
        console.log(`   Comment: ${commentText}`);
        console.log(`   Post ID: ${postId}`);
        
        // 檢查留言是否包含關鍵字
        const keywords = process.env.KEYWORDS ? process.env.KEYWORDS.split(',').map(k => k.trim()) : [];
        const hasKeyword = keywords.some(keyword => commentText.includes(keyword));
        
        if (hasKeyword) {
          console.log(`✅ Keyword matched! Sending response...`);
          // 處理符合關鍵字的留言
          handleMessage({
            sender: { id: senderId },
            message: { text: commentText },
            postId: postId,
            commentId: commentId,
            senderName: senderName
          });
        } else {
          console.log(`ℹ️  No keyword match. Keywords: ${keywords.join(', ')}`);
        }
      }
    }
  });
}

/**
 * 驗證請求簽名（確保請求來自 Facebook）
 */
function verifyRequestSignature(req, buf) {
  const signature = req.headers['x-hub-signature-256'];
  
  if (!signature) {
    console.warn('⚠️  No signature found in request headers');
    // 在開發環境中可能不需要驗證
    return process.env.NODE_ENV === 'development';
  }
  
  const APP_SECRET = process.env.FACEBOOK_APP_SECRET;
  if (!APP_SECRET) {
    console.error('❌ FACEBOOK_APP_SECRET not configured');
    return false;
  }
  
  const elements = signature.split('=');
  const signatureHash = elements[1];
  const expectedHash = crypto.createHmac('sha256', APP_SECRET)
    .update(buf, 'utf-8')
    .digest('hex');
  
  return signatureHash === expectedHash;
}

module.exports = router;
