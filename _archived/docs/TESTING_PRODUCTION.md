# 🚀 Facebook App 上線後測試指南

## ✅ 您已完成的步驟

- [x] Facebook App 從「開發中」轉為「上線」
- [x] Firebase Functions 已部署
- [x] Webhook URL 已設定
- [x] 隱私政策已設定

## 📝 完整測試流程

### 步驟 1：確認 App 設定

前往 [Facebook Developers](https://developers.facebook.com/)

#### 檢查清單：
1. **應用程式狀態：** 確認顯示「上線」✅
2. **Webhook 設定：**
   - URL: `https://asia-east1-fanbot-b8f92.cloudfunctions.net/bot`
   - 驗證權杖: `my_verify_token_123`
   - 訂閱欄位: ✅ `feed`, ✅ `messages`
3. **隱私政策：** `https://asia-east1-fanbot-b8f92.cloudfunctions.net/bot/privacy`
4. **資料刪除：** `https://asia-east1-fanbot-b8f92.cloudfunctions.net/bot/deletion`

### 步驟 2：確認粉絲頁訂閱

1. 前往 **Webhooks** 頁面
2. 找到您的粉絲頁
3. 確認已訂閱以下欄位：
   - ✅ `feed` (用於監聽留言)
   - ✅ `messages` (用於發送私訊)

如果沒有訂閱，點擊 **Subscribe** 按鈕。

### 步驟 3：檢查權限

確認您的 App 有以下權限：

**必要權限：**
- ✅ `pages_manage_metadata`
- ✅ `pages_read_engagement`
- ✅ `pages_messaging`
- ✅ `pages_manage_posts`

**檢查方式：**
1. Facebook Developers → 應用程式審查 → 權限和功能
2. 確認以上權限都是「已啟用」狀態

### 步驟 4：測試 Webhook（重要！）

在終端機執行：

\`\`\`bash
# 測試 Webhook 驗證
curl "https://asia-east1-fanbot-b8f92.cloudfunctions.net/bot?hub.mode=subscribe&hub.verify_token=my_verify_token_123&hub.challenge=TEST123"
\`\`\`

**預期結果：** 應該返回 `TEST123`

### 步驟 5：測試隱私政策頁面

在瀏覽器打開：
\`\`\`
https://asia-east1-fanbot-b8f92.cloudfunctions.net/bot/privacy
\`\`\`

**預期結果：** 應該看到完整的隱私政策頁面

### 步驟 6：實際測試機器人功能 🎯

#### 測試 A：留言觸發
1. **前往您的 Facebook 粉絲頁**
2. **發布一篇新貼文**（任何內容都可以）
3. **在貼文下留言**，包含關鍵字：
   - 「抽獎」
   - 「參加」
   - 「+1」
   - 「我要」
4. **等待 5-10 秒**
5. **檢查您的 Messenger** 是否收到來自粉絲頁的私訊和圖片

#### 測試 B：查看 Firebase 日誌

在終端機執行：
\`\`\`bash
firebase functions:log --only bot --lines 20
\`\`\`

**應該看到的日誌：**
\`\`\`
💬 New comment: [您的名字] - [您的留言內容]
✅ Keyword matched!
🤖 Processing message from [您的名字]...
💾 Comment log saved
💾 User info saved
📸 Image sent: https://picsum.photos/200
📸 Image sent: https://picsum.photos/300
✅ Response sent successfully!
\`\`\`

### 步驟 7：驗證 Firestore 資料庫

1. 前往 [Firebase Console](https://console.firebase.google.com/project/fanbot-b8f92/firestore)
2. 檢查 **comments** collection
   - 應該有新的留言記錄
   - 包含 userId, commentText, postId, timestamp
3. 檢查 **users** collection
   - 應該有使用者資訊
   - 包含 name, lastMessage, lastInteraction

### 步驟 8：測試不同情境

#### 情境 1：沒有關鍵字的留言
- 留言：「這是測試留言」
- **預期：** 不會收到私訊
- **日誌：** `ℹ️ No keyword match`

#### 情境 2：重複留言同一個貼文
- 第一次留言：「抽獎」→ 會收到私訊
- 第二次留言：「抽獎」→ **不會**收到私訊（避免重複）
- **日誌：** `ℹ️ User already responded`

#### 情境 3：多個關鍵字
- 留言：「我要參加抽獎活動 +1」
- **預期：** 會收到私訊（任一關鍵字符合即可）

### 步驟 9：壓力測試（可選）

1. **邀請朋友測試**
   - 讓 3-5 個朋友同時留言
   - 確認每個人都收到私訊

2. **測試不同貼文**
   - 在不同貼文下留言
   - 確認機器人都能正常回應

### 步驟 10：監控和維護

#### 設定日誌警報（建議）
\`\`\`bash
# 定期檢查日誌
firebase functions:log --only bot --lines 100
\`\`\`

#### 檢查 Firebase 配額
前往 [Firebase Console](https://console.firebase.google.com/project/fanbot-b8f92/usage)
- 查看 Functions 調用次數
- 查看 Firestore 讀寫次數

## 🐛 常見問題排除

### 問題 1：留言後沒收到私訊

**可能原因：**
1. ❌ Webhook 未訂閱粉絲頁
2. ❌ Page Access Token 過期
3. ❌ 留言沒有包含關鍵字
4. ❌ 已經回應過該貼文

**解決方法：**
\`\`\`bash
# 1. 檢查日誌
firebase functions:log --only bot --lines 50

# 2. 測試 Webhook
curl "https://asia-east1-fanbot-b8f92.cloudfunctions.net/bot"
# 應該返回: "Facebook Bot is running on Firebase! 🤖🔥"
\`\`\`

### 問題 2：收到錯誤訊息

**檢查步驟：**
1. 查看 Firebase 日誌找到錯誤訊息
2. 確認 Page Access Token 沒有過期
3. 確認粉絲頁權限正確

**更新 Token（如果需要）：**
\`\`\`bash
# 1. 取得新的 Page Access Token
# 2. 更新 functions/.env.yaml
# 3. 重新部署
firebase deploy --only functions
\`\`\`

### 問題 3：圖片發送失敗

**可能原因：**
- 圖片 URL 無效或無法訪問

**測試圖片 URL：**
\`\`\`bash
curl -I https://picsum.photos/200
# 應該返回 200 OK
\`\`\`

## 📊 成功指標

測試成功的標準：

- ✅ 留言後 5-10 秒內收到私訊
- ✅ 私訊包含設定的圖片
- ✅ Firestore 有正確的留言記錄
- ✅ 重複留言不會重複發送私訊
- ✅ Firebase 日誌沒有錯誤訊息

## 🎯 快速測試命令

將以下命令存成腳本方便測試：

\`\`\`bash
#!/bin/bash
# test-bot.sh

echo "🧪 測試 Webhook 驗證..."
curl "https://asia-east1-fanbot-b8f92.cloudfunctions.net/bot?hub.mode=subscribe&hub.verify_token=my_verify_token_123&hub.challenge=TEST"
echo ""

echo "🧪 測試機器人狀態..."
curl "https://asia-east1-fanbot-b8f92.cloudfunctions.net/bot"
echo ""

echo "🧪 測試隱私政策頁面..."
curl -I "https://asia-east1-fanbot-b8f92.cloudfunctions.net/bot/privacy" | grep "200 OK"

echo "📊 查看最新日誌..."
firebase functions:log --only bot --lines 10
\`\`\`

執行測試：
\`\`\`bash
chmod +x test-bot.sh
./test-bot.sh
\`\`\`

## 🎉 測試完成後

如果所有測試都通過：

1. ✅ 記錄測試結果
2. ✅ 通知團隊成員機器人已上線
3. ✅ 開始正式使用於粉絲頁活動
4. ✅ 定期檢查日誌和資料庫

## 📞 需要幫助？

如果測試過程中遇到問題：
1. 查看 Firebase 日誌：\`firebase functions:log --only bot\`
2. 查看 Facebook Webhook 設定
3. 確認 App 權限正確
4. 檢查 Page Access Token 是否有效

---

**祝測試順利！** 🚀

如果一切正常，您的粉絲頁機器人現在已經可以正式使用了！
