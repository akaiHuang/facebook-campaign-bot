/**
 * 檢查 Firestore 中的配置
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkConfig() {
  try {
    const configDoc = await db.collection('config').doc('bot').get();
    
    if (!configDoc.exists) {
      console.log('❌ 配置文件不存在');
      process.exit(1);
    }
    
    const config = configDoc.data();
    console.log('📋 當前 Firestore 配置:\n');
    
    // 顯示所有欄位（隱藏敏感資訊的完整內容）
    Object.keys(config).forEach(key => {
      if (key.includes('TOKEN') || key.includes('SECRET')) {
        const value = config[key];
        console.log(`${key}: ${value ? value.substring(0, 20) + '...' : '(未設定)'}`);
      } else {
        console.log(`${key}:`, config[key]);
      }
    });
    
    console.log('\n✅ 配置讀取完成');
    
  } catch (error) {
    console.error('❌ 讀取配置失敗:', error);
  } finally {
    process.exit(0);
  }
}

checkConfig();
