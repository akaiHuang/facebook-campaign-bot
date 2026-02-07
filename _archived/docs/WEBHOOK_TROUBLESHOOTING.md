# 🔧 Facebook Webhook 設定問題排除指南

## ❌ 問題現象
您在粉絲頁留言後，機器人沒有回應，Firebase 日誌也沒有收到留言事件。

## 🔍 根本原因
**Facebook 沒有將留言事件發送到您的 Webhook**

## ✅ 解決步驟

### 步驟 1：檢查 Webhook 訂閱設定

1. 前往 [Facebook Developers](https://developers.facebook.com/)
2. 選擇您的應用程式
3. 左側選單 → **Webhooks**

### 步驟 2：確認粉絲頁訂閱

在 Webhooks 頁面中，找到 **Page（粉絲頁）** 區塊：

#### 必須訂閱的欄位：
- ✅ **feed** ← **這是最重要的！用於監聽留言**
- ✅ **messages** ← 用於發送私訊

#### 檢查方式：
1. 在 Page 區塊中，點擊 **Edit Subscription**（編輯訂閱）
2. 確認以下欄位有打勾：
   ```
   ☑ feed
   ☑ messages
   ```
3. 如果沒有勾選，請勾選後點擊 **Save**

### 步驟 3：確認粉絲頁已連接

#### 重要：您必須將您的粉絲頁連接到 App

1. 在 Webhooks 頁面
2. Page 區塊應該顯示您的粉絲頁名稱
3. 如果沒有顯示粉絲頁，需要訂閱：

#### 訂閱粉絲頁的步驟：
1. 在 **Page** 區塊中
2. 點擊 **Subscribe to this object**（訂閱此物件）
3. 選擇您要監聽的粉絲頁
4. 勾選 `feed` 和 `messages`
5. 點擊 **Subscribe**

### 步驟 4：檢查 Webhook URL 和驗證權杖

確認設定正確：

- **Callback URL:** `https://asia-east1-fanbot-b8f92.cloudfunctions.net/bot`
- **Verify Token:** `my_verify_token_123`

### 步驟 5：測試訂閱狀態

在終端機執行以下命令測試：

\`\`\`bash
# 測試 Webhook 是否運作
curl "https://asia-east1-fanbot-b8f92.cloudfunctions.net/bot?hub.mode=subscribe&hub.verify_token=my_verify_token_123&hub.challenge=TEST"
\`\`\`

應該返回：`TEST`

### 步驟 6：重新測試

完成上述設定後：

1. 在粉絲頁發布新貼文
2. 在貼文下留言包含關鍵字（例如：「抽獎」、「參加」）
3. 執行以下命令查看日誌：
   \`\`\`bash
   firebase functions:log --only bot --lines 30
   \`\`\`

## 📊 成功的日誌應該顯示：

\`\`\`
💬 New comment: [您的名字] - [留言內容]
✅ Keyword matched!
🤖 Processing message from [您的名字]...
💾 Saved
📸 Image sent: https://picsum.photos/200
📸 Image sent: https://picsum.photos/300
✅ Sent
\`\`\`

## 🎯 最常見的問題

### 問題 1：沒有訂閱 `feed` 欄位
**症狀：** 留言後沒有任何反應，日誌沒有收到事件  
**解決：** 在 Webhooks → Page → Edit Subscription → 勾選 `feed`

### 問題 2：粉絲頁沒有連接到 App
**症狀：** Webhooks 頁面沒有顯示粉絲頁名稱  
**解決：** 點擊 Subscribe to this object 選擇您的粉絲頁

### 問題 3：App 權限不足
**症狀：** 無法訂閱 feed 或 messages  
**解決：** 前往 App Review → Permissions and Features → 確認權限已啟用

### 問題 4：Page Access Token 過期
**症狀：** 機器人無法發送私訊  
**解決：** 重新生成 Page Access Token 並更新到 functions/.env.yaml

## 🔍 詳細檢查清單

請逐一確認：

- [ ] App 狀態是「上線」
- [ ] Webhook URL 設定正確
- [ ] Verify Token 是 `my_verify_token_123`
- [ ] 已訂閱 `feed` 欄位 ← **最重要！**
- [ ] 已訂閱 `messages` 欄位
- [ ] 粉絲頁已連接到 App
- [ ] Page Access Token 有效
- [ ] App 有 `pages_manage_metadata` 權限
- [ ] App 有 `pages_read_engagement` 權限
- [ ] App 有 `pages_messaging` 權限

## 📸 正確的 Webhooks 設定截圖參考

### Webhook 基本設定
\`\`\`
Callback URL: https://asia-east1-fanbot-b8f92.cloudfunctions.net/bot
Verify Token: my_verify_token_123
\`\`\`

### Page 訂閱欄位
\`\`\`
☑ feed          ← 監聽留言
☑ messages      ← 發送私訊
\`\`\`

## 🆘 還是不行？

### 使用 Graph API Explorer 測試

1. 前往 [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. 選擇您的 App
3. 選擇您的粉絲頁 Access Token
4. 執行：`GET /{page_id}/subscribed_apps`
5. 應該看到您的 App 和訂閱的欄位

### 檢查 App 審查狀態

某些權限需要 Facebook 審查：
1. 前往 App Review
2. 確認所需權限都已批准或在審查中

## 💡 快速解決方案

如果您急著測試，可以先使用**測試用戶**：

1. Facebook Developers → Roles → Test Users
2. 建立測試用戶
3. 使用測試用戶在粉絲頁留言
4. 測試環境中的功能會立即生效

---

**記住：最常見的問題就是忘記訂閱 `feed` 欄位！** ✅
