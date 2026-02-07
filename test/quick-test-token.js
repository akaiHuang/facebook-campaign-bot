/**
 * 快速測試 Token 是否能獲取貼文
 */

const axios = require('axios');

const PAGE_ACCESS_TOKEN = 'EAATMnASMNEsBP0ZBeIDKeO2DwtyzCk9yxyEu7ZAh18crGh59ONAePCw8YQK9KmtPEBpMOJShK72g8BEilGoxP1oUtef14orZACLdyZBrPKI232sFTCsebZC1sv6zZBAwUw4MgGHBjVtZBzoXuC2pZBPvPBDh4r59pjtUWGxyWv00aXr7L6n7ObXVcFHOnABod7aSqtUWiwZDZD';
const FACEBOOK_PAGE_ID = '261205178149570';

async function testToken() {
  console.log('🔍 測試 Facebook Token 權限...\n');
  console.log(`Token: ${PAGE_ACCESS_TOKEN.substring(0, 20)}...`);
  console.log(`Page ID: ${FACEBOOK_PAGE_ID}\n`);
  
  try {
    // 測試 1: 獲取貼文清單
    console.log('📄 測試：獲取最近 5 則貼文...');
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}/posts`,
      {
        params: {
          fields: 'id,message,created_time,permalink_url',
          limit: 5,
          access_token: PAGE_ACCESS_TOKEN
        }
      }
    );
    
    if (response.data.data && response.data.data.length > 0) {
      console.log(`✅ 成功！獲取到 ${response.data.data.length} 則貼文\n`);
      
      response.data.data.forEach((post, index) => {
        console.log(`貼文 ${index + 1}:`);
        console.log(`  ID: ${post.id}`);
        console.log(`  內容: ${post.message ? post.message.substring(0, 60) + '...' : '(無文字)'}`);
        console.log(`  時間: ${new Date(post.created_time).toLocaleString('zh-TW')}`);
        console.log(`  連結: ${post.permalink_url}\n`);
      });
      
      console.log('✅ Token 有效！可以使用這個 token 獲取貼文清單');
    } else {
      console.log('⚠️  API 成功但沒有貼文資料');
    }
    
  } catch (error) {
    console.error('❌ 測試失敗！\n');
    
    if (error.response?.data?.error) {
      const fbError = error.response.data.error;
      console.error(`錯誤代碼: ${fbError.code}`);
      console.error(`錯誤訊息: ${fbError.message}`);
      console.error(`錯誤類型: ${fbError.type}\n`);
      
      if (fbError.code === 190) {
        console.log('💡 Token 無效或已過期');
        console.log('   解決方案：');
        console.log('   1. 到 Graph API Explorer 重新生成 Token');
        console.log('   2. 確保包含 pages_show_list 權限');
      } else if (fbError.code === 200 || fbError.code === 210) {
        console.log('💡 Token 缺少必要權限');
        console.log('   需要的權限：');
        console.log('   - pages_show_list');
        console.log('   - pages_read_engagement');
      } else if (fbError.code === 100) {
        console.log('💡 參數錯誤或粉絲專頁 ID 不正確');
      }
    } else {
      console.error('詳細錯誤:', error.message);
    }
  }
}

testToken();
