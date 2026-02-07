const express = require('express');
const router = express.Router();
const crypto = require('crypto');

/**
 * Facebook 資料刪除要求端點
 * 當用戶要求刪除資料時，Facebook 會呼叫此端點
 */
router.post('/deletion', (req, res) => {
  try {
    const signedRequest = req.body.signed_request;
    
    if (!signedRequest) {
      return res.status(400).json({ error: 'Missing signed_request' });
    }
    
    // 解析 signed_request
    const [encodedSig, payload] = signedRequest.split('.');
    const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    
    const userId = data.user_id;
    const appId = data.app_id;
    
    console.log(`📋 Data deletion request received for user: ${userId}`);
    
    // 在這裡處理資料刪除
    // TODO: 從 Firestore 刪除該用戶的資料
    // 例如：
    // - 刪除 users collection 中的用戶資料
    // - 刪除 comments collection 中該用戶的留言記錄
    
    // 生成確認碼（用於追蹤刪除狀態）
    const confirmationCode = crypto.randomBytes(16).toString('hex');
    
    // 回傳確認碼給 Facebook
    res.json({
      url: `https://你的網域/deletion/status?id=${confirmationCode}`,
      confirmation_code: confirmationCode
    });
    
  } catch (error) {
    console.error('❌ Error handling deletion request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 查詢資料刪除狀態端點（可選）
 */
router.get('/deletion/status', (req, res) => {
  const confirmationCode = req.query.id;
  
  // 在這裡查詢刪除狀態
  // 實際應用中，你需要記錄刪除狀態到資料庫
  
  res.send(`
    <html>
      <head><title>Data Deletion Status</title></head>
      <body>
        <h1>Data Deletion Request</h1>
        <p>Confirmation Code: ${confirmationCode}</p>
        <p>Status: Completed</p>
        <p>Your data has been deleted from our system.</p>
      </body>
    </html>
  `);
});

module.exports = router;
