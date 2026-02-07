# 📱 粉絲團機器人測試與使用指南

## 🧪 測試機器人

### 方法 1：監聽所有文章（預設）

1. 前往你的 Facebook 粉絲專頁
2. 發布一篇測試貼文
3. 用另一個帳號留言，內容包含關鍵字：
   - 「我要參加抽獎」
   - 「+1」
   - 「參加」
   - 「我要」
4. 留言者會在 Messenger 收到機器人發送的圖片

### 方法 2：只監聽特定文章

#### 步驟 1：取得文章 ID

**選項 A - 使用工具自動提取：**
```bash
node get-post-id.js "https://www.facebook.com/yourpage/posts/123456789"
```

**選項 B - 手動從網址提取：**

文章網址範例：
```
https://www.facebook.com/yourpage/posts/123456789_987654321
```
文章 ID 就是：`123456789_987654321`

#### 步驟 2：設定 .env 檔案

編輯 `.env` 檔案，找到 `TARGET_POST_IDS` 這一行：

```env
# 監聽單一文章
TARGET_POST_IDS=123456789_987654321

# 監聽多篇文章（用逗號分隔）
TARGET_POST_IDS=123456789_987654321,111222333_444555666

# 監聽所有文章（留空）
TARGET_POST_IDS=
```

#### 步驟 3：更新環境變數並重新部署

```bash
# 更新 Firebase Functions 環境變數
firebase functions:config:set bot.target_post_ids="你的文章ID"

# 重新部署
firebase deploy --only functions
```

或者直接重新部署（會自動讀取 .env）：
```bash
firebase deploy --only functions
```

---

## 📋 如何獲取文章 ID？

### 方法 1：從瀏覽器網址列複製

1. 在電腦上開啟 Facebook
2. 點擊進入你要監聽的文章
3. 複製瀏覽器網址列的完整網址
4. 使用工具提取 ID：
   ```bash
   node get-post-id.js "貼上你的網址"
   ```

### 方法 2：手動提取

常見網址格式：
```
https://www.facebook.com/yourpage/posts/123456789
→ 文章 ID: 123456789

https://www.facebook.com/123456789/posts/987654321
→ 文章 ID: 123456789_987654321

https://www.facebook.com/permalink.php?story_fbid=123456789&id=987654321
→ 文章 ID: 123456789
```

---

## 🔍 查看運作日誌

### 查看 Firebase Functions 日誌：

```bash
firebase functions:log
```

或在 Firebase Console 查看：
```
https://console.firebase.google.com/project/fanbot-b8f92/functions/logs
```

### 日誌說明：

```
💬 New comment received:     - 收到新留言
   User: 張三 (123456)       - 留言者資訊
   Comment: 我要參加         - 留言內容
   Post ID: 123_456          - 文章 ID

⏭️  Skipping - Post ID...    - 跳過（不在監聽清單中）
✅ Keyword matched!          - 關鍵字匹配成功
📸 Image sent: ...           - 圖片發送成功
💾 Comment log saved         - 記錄已儲存
```

---

## 🎯 使用場景範例

### 場景 1：單次抽獎活動
```env
# 只監聽抽獎文章
TARGET_POST_IDS=123456789_987654321
KEYWORDS=抽獎,參加,+1
IMAGE_URLS=https://yoursite.com/prize-image.jpg
```

### 場景 2：長期活動
```env
# 監聽所有文章
TARGET_POST_IDS=
KEYWORDS=索取,報名,我要
IMAGE_URLS=https://yoursite.com/info.jpg,https://yoursite.com/guide.jpg
```

### 場景 3：多個活動
```env
# 監聽多篇活動文章
TARGET_POST_IDS=文章1_ID,文章2_ID,文章3_ID
KEYWORDS=參加,+1,我要,報名
IMAGE_URLS=https://yoursite.com/reward.jpg
```

---

## ⚙️ 修改設定

### 修改關鍵字：
編輯 `.env` 中的 `KEYWORDS`，用逗號分隔多個關鍵字。

### 修改回應圖片：
編輯 `.env` 中的 `IMAGE_URLS`，用逗號分隔多張圖片。

### 重新部署：
```bash
firebase deploy --only functions
```

---

## 🐛 常見問題

### Q: 機器人沒有回應？
A: 檢查以下項目：
1. Facebook Webhook 是否已設定並訂閱 `feed` 欄位
2. 留言是否包含設定的關鍵字
3. 如果設定了 `TARGET_POST_IDS`，確認文章 ID 正確
4. 查看 Firebase Functions 日誌確認是否有收到事件

### Q: 如何確認文章 ID 正確？
A: 
1. 使用 `node get-post-id.js` 工具
2. 發布測試留言後，在日誌中查看 "Post ID: xxx"
3. 將該 ID 加入 `TARGET_POST_IDS`

### Q: 可以同時監聽多個文章嗎？
A: 可以！在 `TARGET_POST_IDS` 中用逗號分隔多個 ID：
```env
TARGET_POST_IDS=ID1,ID2,ID3
```

### Q: 想要關閉特定文章監聽？
A: 將 `TARGET_POST_IDS` 設為空值即可監聽所有文章：
```env
TARGET_POST_IDS=
```

---

## 📊 查看互動記錄

所有互動記錄都儲存在 Firebase Firestore：

1. 前往 Firebase Console
2. 點擊 Firestore Database
3. 查看 `comments` 和 `users` collections

---

## 🚀 快速命令

```bash
# 提取文章 ID
node get-post-id.js "文章網址"

# 查看日誌
firebase functions:log

# 重新部署
firebase deploy --only functions

# 測試連線
curl https://asia-east1-fanbot-b8f92.cloudfunctions.net/bot
```

---

需要更多協助？查看完整文件或提出 issue！
