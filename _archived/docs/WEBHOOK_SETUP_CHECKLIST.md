# Facebook Webhook 完整設定檢查清單

## ⚠️ 目前問題：沒有收到留言事件

從日誌可以看到 Webhook 驗證成功，但沒有收到任何留言事件。

## ✅ 完整設定步驟

### 步驟 1：確認 Webhook 設定

前往：https://developers.facebook.com/apps/584921148016195/messenger/settings/

檢查：
- [x] 回呼網址：https://asia-east1-fanbot-b8f92.cloudfunctions.net/bot
- [x] 驗證權杖：my_verify_token_123
- [x] 驗證狀態：已驗證 ✅

### 步驟 2：訂閱 Webhook 欄位 ⚠️ **最重要！**

在「Webhook 欄位」區塊中，確保以下欄位已**開啟**（藍色圓點）：

必須開啟的欄位：
- [ ] **feed** - 接收貼文留言事件（必須！）
- [ ] **messages** - 接收私訊
- [ ] **messaging_postbacks** - 接收按鈕互動

### 步驟 3：訂閱粉絲專頁 ⚠️ **關鍵步驟！**

這是最容易遺漏的步驟：

1. 在 Messenger 設定頁面往下滾動
2. 找到「Webhook」區塊
3. 點擊「新增或移除粉絲專頁」
4. 選擇你的粉絲專頁「Kreme Select」
5. 點擊「訂閱」按鈕

**重要：** 每個粉絲專頁都需要個別訂閱！

### 步驟 4：確認訂閱狀態

在 Webhook 區塊應該會看到：
```
粉絲專頁：Kreme Select
狀態：已訂閱 ✅
```

## 🧪 測試步驟

完成上述設定後：

1. 到粉絲專頁發布新貼文（或使用現有貼文）
2. 用另一個帳號留言包含關鍵字
3. 等待 5-10 秒
4. 留言者應該會收到 Messenger 訊息

## 🔍 驗證方法

### 方法 1：查看 Firebase 日誌

```bash
firebase functions:log
```

成功時會看到：
```
💬 New comment received:
   User: XXX (ID)
   Comment: 我要參加抽獎
   Post ID: XXX
✅ Keyword matched! Sending response...
📸 Image sent: ...
```

### 方法 2：測試 Webhook

前往：https://developers.facebook.com/apps/584921148016195/messenger/settings/

點擊「測試」按鈕發送測試事件。

## ❓ 常見問題

### Q: Webhook 已驗證但沒收到事件？
A: 檢查是否已訂閱粉絲專頁到 Webhook（步驟 3）

### Q: 如何確認訂閱成功？
A: 在 Messenger 設定頁面的 Webhook 區塊會顯示已訂閱的粉絲專頁清單

### Q: 多個粉絲專頁怎麼設定？
A: 每個粉絲專頁都需要個別訂閱到 Webhook

## 📸 參考截圖位置

你需要在這些地方設定：

1. **Messenger 設定** → **Webhooks** → **訂閱欄位**
   - 開啟 feed, messages, messaging_postbacks

2. **Messenger 設定** → **Webhooks** → **粉絲專頁訂閱**
   - 新增並訂閱你的粉絲專頁

## 🚨 如果還是不行

1. 確認粉絲專頁權限（你需要是管理員）
2. 確認 App 處於開發模式或已發布
3. 確認 Page Access Token 正確
4. 嘗試重新訂閱粉絲專頁

---

完成設定後，請再次測試並查看日誌！
