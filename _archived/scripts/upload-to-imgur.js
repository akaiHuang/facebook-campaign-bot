const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function uploadToImgur(imagePath) {
  try {
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));
    
    const response = await axios.post('https://api.imgur.com/3/image', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': 'Client-ID 3e7a4deb7ac67da' // Public Imgur Client ID
      }
    });
    
    return response.data.data.link;
  } catch (error) {
    console.error('Error uploading to Imgur:', error.message);
    throw error;
  }
}

async function main() {
  console.log('📤 Uploading images to Imgur...\n');
  
  const url1 = await uploadToImgur('./img/1.png');
  console.log(`✅ 1.png uploaded: ${url1}`);
  
  const url2 = await uploadToImgur('./img/2.png');
  console.log(`✅ 2.png uploaded: ${url2}`);
  
  console.log('\n✅ All images uploaded successfully!');
  console.log('\n📋 Update your .env.yaml with these URLs:');
  console.log(`IMAGE_URLS: "${url1},${url2}"`);
  
  process.exit(0);
}

main();
