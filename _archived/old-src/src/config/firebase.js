const admin = require('firebase-admin');

let db = null;

/**
 * 初始化 Firebase Admin SDK
 */
function initializeFirebase() {
  try {
    // 從環境變數讀取服務帳號金鑰路徑
    const serviceAccountPath = process.env.FIREBASE_PRIVATE_KEY_PATH || './serviceAccountKey.json';
    
    // 檢查是否已經初始化
    if (admin.apps.length === 0) {
      const serviceAccount = require(`../../${serviceAccountPath}`);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
      });
      
      db = admin.firestore();
      console.log('✅ Firebase initialized successfully');
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.log('ℹ️  請確認已設定 serviceAccountKey.json 檔案');
  }
}

/**
 * 取得 Firestore 資料庫實例
 */
function getFirestore() {
  if (!db) {
    throw new Error('Firebase has not been initialized. Call initializeFirebase() first.');
  }
  return db;
}

/**
 * 儲存留言記錄到 Firebase
 */
async function saveCommentLog(userId, commentText, postId, timestamp) {
  try {
    const db = getFirestore();
    await db.collection('comments').add({
      userId,
      commentText,
      postId,
      timestamp: timestamp || admin.firestore.FieldValue.serverTimestamp(),
      responded: true
    });
    console.log('💾 Comment log saved to Firebase');
  } catch (error) {
    console.error('❌ Error saving comment log:', error);
  }
}

/**
 * 儲存用戶資訊到 Firebase
 */
async function saveUserInfo(userId, userInfo) {
  try {
    const db = getFirestore();
    await db.collection('users').doc(userId).set({
      ...userInfo,
      lastInteraction: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log('💾 User info saved to Firebase');
  } catch (error) {
    console.error('❌ Error saving user info:', error);
  }
}

/**
 * 檢查用戶是否已經回應過
 */
async function hasUserResponded(userId, postId) {
  try {
    const db = getFirestore();
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

module.exports = {
  initializeFirebase,
  getFirestore,
  saveCommentLog,
  saveUserInfo,
  hasUserResponded
};
