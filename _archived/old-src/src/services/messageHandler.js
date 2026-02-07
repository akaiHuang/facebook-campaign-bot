const axios = require('axios');
const { saveCommentLog, saveUserInfo, hasUserResponded } = require('../config/firebase');

const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const GRAPH_API_VERSION = 'v18.0';
const GRAPH_API_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

/**
 * 處理接收到的訊息
 */
async function handleMessage(event) {
  const senderId = event.sender.id;
  const messageText = event.message?.text || '';
  const postId = event.postId;
  const senderName = event.senderName || 'User';
  
  console.log(`\n🤖 Processing message from ${senderName}...`);
  
  try {
    // 檢查是否已經回應過（避免重複回應）
    if (postId) {
      const responded = await hasUserResponded(senderId, postId);
      if (responded) {
        console.log('ℹ️  User has already been responded to for this post');
        return;
      }
    }
    
    // 儲存留言記錄到 Firebase
    if (postId) {
      await saveCommentLog(senderId, messageText, postId, new Date());
    }
    
    // 儲存用戶資訊
    await saveUserInfo(senderId, {
      name: senderName,
      lastMessage: messageText
    });
    
    // 發送回應訊息（圖片）
    await sendImages(senderId);
    
    console.log('✅ Response sent successfully!');
    
  } catch (error) {
    console.error('❌ Error handling message:', error.message);
  }
}

/**
 * 發送單張圖片
 */
async function sendImage(recipientId, imageUrl) {
  try {
    const messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: 'image',
          payload: {
            url: imageUrl,
            is_reusable: true
          }
        }
      }
    };
    
    const response = await axios.post(
      `${GRAPH_API_URL}/me/messages`,
      messageData,
      {
        params: {
          access_token: PAGE_ACCESS_TOKEN
        }
      }
    );
    
    console.log(`📸 Image sent: ${imageUrl}`);
    return response.data;
    
  } catch (error) {
    console.error('❌ Error sending image:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 發送多張圖片
 */
async function sendImages(recipientId) {
  try {
    // 從環境變數讀取圖片 URL
    const imageUrls = process.env.IMAGE_URLS 
      ? process.env.IMAGE_URLS.split(',').map(url => url.trim())
      : [];
    
    if (imageUrls.length === 0) {
      console.warn('⚠️  No image URLs configured in .env file');
      // 如果沒有設定圖片，發送文字訊息
      await sendTextMessage(recipientId, '感謝您的參與！🎉');
      return;
    }
    
    // 依序發送每張圖片
    for (const imageUrl of imageUrls) {
      await sendImage(recipientId, imageUrl);
      // 避免發送太快，稍微延遲
      await sleep(500);
    }
    
  } catch (error) {
    console.error('❌ Error sending images:', error.message);
    throw error;
  }
}

/**
 * 發送文字訊息
 */
async function sendTextMessage(recipientId, text) {
  try {
    const messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: text
      }
    };
    
    const response = await axios.post(
      `${GRAPH_API_URL}/me/messages`,
      messageData,
      {
        params: {
          access_token: PAGE_ACCESS_TOKEN
        }
      }
    );
    
    console.log(`💬 Text message sent: ${text}`);
    return response.data;
    
  } catch (error) {
    console.error('❌ Error sending text message:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 發送按鈕模板訊息
 */
async function sendButtonTemplate(recipientId, text, buttons) {
  try {
    const messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: text,
            buttons: buttons
          }
        }
      }
    };
    
    const response = await axios.post(
      `${GRAPH_API_URL}/me/messages`,
      messageData,
      {
        params: {
          access_token: PAGE_ACCESS_TOKEN
        }
      }
    );
    
    console.log(`🔘 Button template sent`);
    return response.data;
    
  } catch (error) {
    console.error('❌ Error sending button template:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 延遲函數
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  handleMessage,
  sendImage,
  sendImages,
  sendTextMessage,
  sendButtonTemplate
};
