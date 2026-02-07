# 🎉 Firebase 部署成功！

## ✅ 部署資訊

**專案 ID:** fanbot-b8f92  
**區域:** asia-east1  
**部署時間:** 2025年10月23日

## 🔗 重要網址

### 主要端點
```
https://bot-f73xf642oq-de.a.run.app
```

### Webhook URL（給 Facebook 用）
```
https://bot-f73xf642oq-de.a.run.app
```

### 隱私政策 URL
```
https://bot-f73xf642oq-de.a.run.app/privacy
或
https://bot-f73xf642oq-de.a.run.app/privacy/policy
```

### 資料刪除 URL
```
https://bot-f73xf642oq-de.a.run.app/deletion
```

## 📝 下一步：設定 Facebook

### 1. 更新 Webhook URL

前往 [Facebook Developers](https://developers.facebook.com/)

1. 選擇您的應用程式
2. 左側選單 → **Webhooks**
3. 點擊 **Edit Subscription**（編輯訂閱）
4. 填入以下資訊：
   - **回呼 URL:** `https://bot-f73xf642oq-de.a.run.app`
   - **驗證權杖:** `my_verify_token_123`
5. 訂閱欄位：勾選 `feed` 和 `messages`
6. 點擊 **驗證並儲存**

### 2. 更新隱私政策 URL

1. 左側選單 → **應用程式設定** → **基本資料**
2. 找到 **隱私政策網址**
3. 填入：`https://bot-f73xf642oq-de.a.run.app/privacy`
4. 找到 **使用者資料刪除**
5. 選擇「資料刪除說明網址」
6. 填入：`https://bot-f73xf642oq-de.a.run.app/deletion`
7. 點擊 **儲存變更**

## 🧪 測試部署

### 測試隱私政策頁面
在瀏覽器中打開：
```
https://bot-f73xf642oq-de.a.run.app/privacy
```

應該會看到完整的隱私政策頁面。

### 測試 Webhook 驗證
在終端機執行：
```bash
curl "https://bot-f73xf642oq-de.a.run.app?hub.mode=subscribe&hub.verify_token=my_verify_token_123&hub.challenge=TEST123"
```

應該返回：`TEST123`

### 測試機器人首頁
在瀏覽器中打開：
```
https://bot-f73xf642oq-de.a.run.app
```

應該會看到：「Facebook Bot is running on Firebase! 🤖🔥」

## 📊 查看日誌

在終端機執行：
```bash
# 即時查看日誌
firebase functions:log --only bot

# 查看最近 100 行日誌
firebase functions:log --only bot --lines 100
```

或前往 [Firebase Console](https://console.firebase.google.com/project/fanbot-b8f92/functions/logs)

## 🔧 環境變數設定

目前的環境變數設定在 `functions/.env.yaml`：

- `FACEBOOK_PAGE_ACCESS_TOKEN`: Facebook 粉絲頁存取權杖
- `FACEBOOK_VERIFY_TOKEN`: my_verify_token_123
- `FACEBOOK_APP_SECRET`: 應用程式密鑰
- `KEYWORDS`: 抽獎,參加,+1,我要
- `IMAGE_URLS`: https://picsum.photos/200,https://picsum.photos/300
- `TARGET_POST_IDS`: （空白 = 監聽所有文章）

### 更新環境變數

如果需要修改環境變數：

1. 編輯 `functions/.env.yaml`
2. 重新部署：
```bash
firebase deploy --only functions
```

## 🎯 功能確認清單

- [x] ✅ Firebase Functions 部署成功
- [x] ✅ 隱私政策頁面可訪問
- [x] ✅ 資料刪除端點已建立
- [x] ✅ Webhook 端點運作中
- [ ] ⏳ 更新 Facebook Webhook URL
- [ ] ⏳ 更新 Facebook 隱私政策 URL
- [ ] ⏳ 在粉絲頁測試留言功能

## 📱 測試機器人

1. 到您的 Facebook 粉絲頁
2. 發布一篇貼文
3. 在貼文下留言包含關鍵字（例如：「抽獎」、「參加」、「+1」、「我要」）
4. 機器人應該會自動發送私訊給您，並附上圖片

## 🔍 除錯技巧

### 如果機器人沒有回應：

1. **檢查日誌：**
```bash
firebase functions:log --only bot --lines 50
```

2. **確認 Webhook 訂閱：**
   - Facebook Developers → Webhooks
   - 確認已訂閱您的粉絲頁

3. **檢查權杖：**
   - 確認 Page Access Token 沒有過期
   - 確認有正確的粉絲頁權限

4. **測試關鍵字：**
   - 確認留言包含設定的關鍵字
   - 關鍵字區分大小寫

## 💰 費用資訊

Firebase Functions 免費方案包含：
- 每月 2,000,000 次調用
- 400,000 GB-秒的計算時間
- 200,000 GHz-秒的 CPU 時間
- 5GB 網路流出

**預估使用：** 一般小型粉絲頁完全在免費額度內。

## 🔄 更新部署

當您修改程式碼後，重新部署：

```bash
cd /Users/akaihuangm1/Desktop/fanpageBot
firebase deploy --only functions
```

## 📚 相關連結

- [Firebase Console](https://console.firebase.google.com/project/fanbot-b8f92/overview)
- [Function Logs](https://console.firebase.google.com/project/fanbot-b8f92/functions/logs)
- [Facebook Developers](https://developers.facebook.com/)
- [Firebase 文件](https://firebase.google.com/docs/functions)

## 🆘 需要幫助？

如果遇到問題，可以：
1. 查看 `FIREBASE_DEPLOY_GUIDE.md` 詳細指南
2. 查看 `TESTING_GUIDE.md` 測試指南
3. 查看 Firebase 日誌找出錯誤

---

**恭喜！您的 Facebook 粉絲頁機器人已成功部署到 Firebase！** 🎊

現在只需要在 Facebook 設定 Webhook URL 和隱私政策 URL，就可以開始使用了！
