#!/usr/bin/env node

/**
 * Facebook 文章 ID 提取工具
 * 
 * 使用方式：
 * node get-post-id.js <文章網址>
 * 
 * 範例：
 * node get-post-id.js "https://www.facebook.com/yourpage/posts/123456789"
 */

const url = process.argv[2];

if (!url) {
  console.log('❌ 請提供文章網址');
  console.log('\n使用方式：');
  console.log('  node get-post-id.js <文章網址>');
  console.log('\n範例：');
  console.log('  node get-post-id.js "https://www.facebook.com/yourpage/posts/123456789"');
  process.exit(1);
}

console.log('\n🔍 解析文章 URL...\n');
console.log(`輸入網址：${url}\n`);

// 提取文章 ID 的各種格式
let postId = null;

// 格式 1: /posts/123456789
const match1 = url.match(/\/posts\/(\d+)/);
if (match1) {
  postId = match1[1];
}

// 格式 2: /permalink/123456789
const match2 = url.match(/\/permalink\/(\d+)/);
if (match2) {
  postId = match2[1];
}

// 格式 3: story_fbid=123456789
const match3 = url.match(/story_fbid=(\d+)/);
if (match3) {
  postId = match3[1];
}

// 格式 4: /123456789_987654321 (完整格式)
const match4 = url.match(/\/(\d+_\d+)/);
if (match4) {
  postId = match4[1];
}

if (postId) {
  console.log('✅ 成功提取文章 ID！\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📋 文章 ID: ${postId}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('📝 設定步驟：');
  console.log('1. 開啟 .env 檔案');
  console.log('2. 找到 TARGET_POST_IDS 這一行');
  console.log('3. 填入文章 ID：\n');
  console.log(`   TARGET_POST_IDS=${postId}\n`);
  console.log('4. 如果要監聽多篇文章，用逗號分隔：\n');
  console.log(`   TARGET_POST_IDS=${postId},另一個ID,再一個ID\n`);
  console.log('5. 儲存檔案後重新部署：\n');
  console.log('   firebase deploy --only functions\n');
  
} else {
  console.log('❌ 無法從網址中提取文章 ID');
  console.log('\n💡 提示：');
  console.log('1. 確認網址格式正確');
  console.log('2. 嘗試從文章頁面複製完整網址');
  console.log('3. 或者手動查看網址中的數字部分\n');
  
  console.log('常見格式：');
  console.log('  https://www.facebook.com/yourpage/posts/123456789');
  console.log('  https://www.facebook.com/permalink/123456789');
  console.log('  https://www.facebook.com/yourpage/posts/123456789_987654321\n');
}
