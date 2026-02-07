/**
 * 測試 Facebook Page Access Token 權限
 * 檢查是否能夠獲取粉絲專頁的貼文
 */

const admin = require('firebase-admin');
const axios = require('axios');

// 初始化 Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function testPagePosts() {
  try {
    console.log('📖 正在從 Firestore 讀取配置...\n');
    
    // 從 Firestore 獲取配置
    const configDoc = await db.collection('config').doc('bot').get();
    const config = configDoc.data();
    
    if (!config) {
      console.error('❌ 找不到配置文件');
      process.exit(1);
    }
    
    const PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN;
    const FACEBOOK_PAGE_ID = config.FACEBOOK_PAGE_ID;
    
    if (!PAGE_ACCESS_TOKEN || !FACEBOOK_PAGE_ID) {
      console.error('❌ 缺少 PAGE_ACCESS_TOKEN 或 FACEBOOK_PAGE_ID');
      process.exit(1);
    }
    
    console.log('✅ 配置讀取成功');
    console.log(`📄 粉絲專頁 ID: ${FACEBOOK_PAGE_ID}\n`);
    
    // 測試 1: 檢查 Token 資訊
    console.log('🔍 測試 1: 檢查 Token 資訊和權限...');
    try {
      const tokenInfo = await axios.get(
        `https://graph.facebook.com/v18.0/debug_token`,
        {
          params: {
            input_token: PAGE_ACCESS_TOKEN,
            access_token: PAGE_ACCESS_TOKEN
          }
        }
      );
      
      console.log('Token 資訊:');
      console.log('  - App ID:', tokenInfo.data.data.app_id);
      console.log('  - Token 類型:', tokenInfo.data.data.type);
      console.log('  - 是否有效:', tokenInfo.data.data.is_valid);
      console.log('  - 過期時間:', tokenInfo.data.data.expires_at === 0 ? '永久有效' : new Date(tokenInfo.data.data.expires_at * 1000).toLocaleString('zh-TW'));
      console.log('  - 權限 (Scopes):', tokenInfo.data.data.scopes?.join(', ') || '無法讀取');
      console.log('');
    } catch (error) {
      console.error('❌ 無法檢查 Token 資訊:', error.response?.data || error.message);
    }
    
    // 測試 2: 獲取粉絲專頁基本資訊
    console.log('🔍 測試 2: 獲取粉絲專頁基本資訊...');
    try {
      const pageInfo = await axios.get(
        `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}`,
        {
          params: {
            fields: 'id,name,access_token',
            access_token: PAGE_ACCESS_TOKEN
          }
        }
      );
      
      console.log('粉絲專頁資訊:');
      console.log('  - ID:', pageInfo.data.id);
      console.log('  - 名稱:', pageInfo.data.name);
      console.log('  - 是否有 Page Token:', !!pageInfo.data.access_token);
      console.log('');
    } catch (error) {
      console.error('❌ 無法獲取粉絲專頁資訊:', error.response?.data || error.message);
      console.log('');
    }
    
    // 測試 3: 獲取貼文清單
    console.log('🔍 測試 3: 嘗試獲取貼文清單...');
    try {
      const postsResponse = await axios.get(
        `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}/posts`,
        {
          params: {
            fields: 'id,message,created_time,permalink_url',
            limit: 5,
            access_token: PAGE_ACCESS_TOKEN
          }
        }
      );
      
      if (postsResponse.data.data && postsResponse.data.data.length > 0) {
        console.log(`✅ 成功獲取 ${postsResponse.data.data.length} 則貼文:\n`);
        
        postsResponse.data.data.forEach((post, index) => {
          console.log(`貼文 ${index + 1}:`);
          console.log(`  - ID: ${post.id}`);
          console.log(`  - 內容: ${post.message ? post.message.substring(0, 50) + '...' : '(無文字內容)'}`);
          console.log(`  - 發布時間: ${new Date(post.created_time).toLocaleString('zh-TW')}`);
          console.log(`  - 連結: ${post.permalink_url}`);
          console.log('');
        });
        
        console.log('✅ Token 權限正常！可以獲取貼文清單');
      } else {
        console.log('⚠️  API 調用成功，但沒有回傳貼文');
        console.log('   可能原因：粉絲專頁沒有公開貼文');
      }
      
    } catch (error) {
      console.error('❌ 無法獲取貼文清單');
      
      if (error.response?.data?.error) {
        const fbError = error.response.data.error;
        console.error(`   錯誤代碼: ${fbError.code}`);
        console.error(`   錯誤訊息: ${fbError.message}`);
        console.error(`   錯誤類型: ${fbError.type}`);
        
        // 根據錯誤代碼提供解決方案
        if (fbError.code === 190) {
          console.log('\n💡 解決方案:');
          console.log('   1. Token 已過期或無效');
          console.log('   2. 請到 Facebook Graph API Explorer 重新生成 Token');
          console.log('   3. 網址: https://developers.facebook.com/tools/explorer/');
        } else if (fbError.code === 200 || fbError.code === 210) {
          console.log('\n💡 解決方案:');
          console.log('   Token 缺少必要權限，需要以下權限:');
          console.log('   - pages_show_list (查看粉絲專頁清單)');
          console.log('   - pages_read_engagement (讀取粉絲專頁互動內容)');
          console.log('   - pages_manage_posts (管理貼文，可選)');
          console.log('\n   請到 Graph API Explorer:');
          console.log('   1. 選擇你的應用程式');
          console.log('   2. 在 Permissions 區域勾選上述權限');
          console.log('   3. 點擊 "Generate Access Token"');
          console.log('   4. 選擇你的粉絲專頁');
          console.log('   5. 複製新的 Token 更新到 Firestore');
        }
      } else {
        console.error('   詳細錯誤:', error.message);
      }
    }
    
    console.log('\n測試完成！');
    
  } catch (error) {
    console.error('❌ 測試過程發生錯誤:', error);
  } finally {
    process.exit(0);
  }
}

// 執行測試
testPagePosts();
