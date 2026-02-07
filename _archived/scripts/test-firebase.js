require('dotenv').config();
const admin = require('firebase-admin');

console.log('🔍 Testing Firebase configuration...\n');

try {
  // 讀取服務帳號金鑰
  const serviceAccountPath = process.env.FIREBASE_PRIVATE_KEY_PATH || './serviceAccountKey.json';
  const serviceAccount = require(serviceAccountPath);
  
  console.log('✅ Service account key file loaded');
  console.log(`📝 Project ID: ${serviceAccount.project_id}`);
  console.log(`📧 Client Email: ${serviceAccount.client_email}\n`);
  
  // 初始化 Firebase
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
  });
  
  console.log('✅ Firebase Admin SDK initialized successfully');
  
  // 測試 Firestore 連線
  const db = admin.firestore();
  console.log('✅ Firestore database instance created\n');
  
  // 嘗試寫入測試資料
  (async () => {
    try {
      const testDoc = await db.collection('test').add({
        message: 'Hello from fanpage bot!',
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log('✅ Test document written successfully');
      console.log(`📄 Document ID: ${testDoc.id}\n`);
      
      // 讀取測試資料
      const doc = await testDoc.get();
      console.log('✅ Test document read successfully');
      console.log('📦 Data:', doc.data());
      
      // 刪除測試資料
      await testDoc.delete();
      console.log('\n✅ Test document deleted');
      
      console.log('\n🎉 Firebase is working perfectly!');
      console.log('👍 You can now proceed to configure Facebook settings.');
      
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Error testing Firestore:', error.message);
      process.exit(1);
    }
  })();
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('\n💡 Please check:');
  console.error('   1. serviceAccountKey.json file exists in the project root');
  console.error('   2. The file contains valid JSON');
  console.error('   3. FIREBASE_PROJECT_ID in .env matches your Firebase project');
  process.exit(1);
}
