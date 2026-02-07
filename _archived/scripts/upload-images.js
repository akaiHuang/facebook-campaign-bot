const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// 初始化 Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'fanbot-b8f92.appspot.com'
});

const bucket = admin.storage().bucket();

async function uploadImage(localPath, remotePath) {
  try {
    const destination = `images/${remotePath}`;
    await bucket.upload(localPath, {
      destination: destination,
      metadata: {
        contentType: 'image/png',
        metadata: {
          firebaseStorageDownloadTokens: require('crypto').randomUUID()
        }
      },
      public: true
    });
    
    const file = bucket.file(destination);
    await file.makePublic();
    
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    console.log(`✅ ${remotePath} uploaded: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`❌ Error uploading ${remotePath}:`, error);
    throw error;
  }
}

async function main() {
  console.log('📤 Uploading images to Firebase Storage...\n');
  
  const url1 = await uploadImage('./img/1.png', '1.png');
  const url2 = await uploadImage('./img/2.png', '2.png');
  
  console.log('\n✅ All images uploaded successfully!');
  console.log('\n📋 Update your .env.yaml with these URLs:');
  console.log(`IMAGE_URLS: "${url1},${url2}"`);
  
  process.exit(0);
}

main();
