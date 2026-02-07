const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function clearComments() {
  console.log('🗑️  開始清空 comments 集合...');
  
  const commentsRef = db.collection('comments');
  const snapshot = await commentsRef.get();
  
  console.log(`📊 找到 ${snapshot.size} 筆記錄`);
  
  if (snapshot.empty) {
    console.log('✅ 集合已經是空的');
    return;
  }
  
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log('✅ 成功清空 comments 集合！');
  
  // 也清空 users 集合（可選）
  const usersRef = db.collection('users');
  const usersSnapshot = await usersRef.get();
  
  if (!usersSnapshot.empty) {
    console.log(`🗑️  清空 users 集合 (${usersSnapshot.size} 筆記錄)...`);
    const usersBatch = db.batch();
    usersSnapshot.docs.forEach((doc) => {
      usersBatch.delete(doc.ref);
    });
    await usersBatch.commit();
    console.log('✅ 成功清空 users 集合！');
  }
  
  process.exit(0);
}

clearComments().catch(console.error);
