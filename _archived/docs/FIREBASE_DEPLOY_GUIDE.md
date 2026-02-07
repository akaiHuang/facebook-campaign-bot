# Firebase 部署指南

## 📋 部署前準備

### 1. 確認已安裝 Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. 登入 Firebase
```bash
firebase login
```

### 3. 初始化專案（如果還沒做過）
```bash
firebase init
```

## 🔧 設定環境變數

Firebase Functions 需要設定環境變數。請執行以下命令：

```bash
# 設定 Facebook 相關變數
firebase functions:config:set \
  facebook.page_access_token="YOUR_PAGE_ACCESS_TOKEN" \
  facebook.verify_token="YOUR_VERIFY_TOKEN" \
  facebook.app_secret="YOUR_APP_SECRET"

# 設定關鍵字（用逗號分隔）
firebase functions:config:set keywords="抽獎,參加,+1,我要"

# 設定圖片 URL（用逗號分隔）
firebase functions:config:set image_urls="https://picsum.photos/200,https://picsum.photos/300"

# 設定目標文章 ID（可選，用逗號分隔）
firebase functions:config:set target_post_ids=""
```

### 查看目前設定
```bash
firebase functions:config:get
```

## 🚀 部署步驟

### 1. 安裝依賴
```bash
cd functions
npm install
cd ..
```

### 2. 部署到 Firebase
```bash
firebase deploy --only functions
```

### 3. 取得部署後的 URL

部署成功後，您會看到類似的 URL：
```
https://asia-east1-fanbot-b8f92.cloudfunctions.net/bot
```

## 🔗 重要網址

部署完成後，您的機器人會有以下端點：

| 功能 | URL |
|------|-----|
| Webhook | `https://asia-east1-PROJECT_ID.cloudfunctions.net/bot` |
| 隱私政策 | `https://asia-east1-PROJECT_ID.cloudfunctions.net/bot/privacy` |
| 資料刪除 | `https://asia-east1-PROJECT_ID.cloudfunctions.net/bot/deletion` |

## 📝 Facebook 設定

### 1. Webhook 設定
1. 到 Facebook Developers > 您的應用程式 > Webhooks
2. 編輯訂閱
3. 回呼 URL：`https://asia-east1-PROJECT_ID.cloudfunctions.net/bot`
4. 驗證權杖：輸入您設定的 `FACEBOOK_VERIFY_TOKEN`
5. 訂閱欄位：勾選 `feed`, `messages`

### 2. 隱私政策設定
1. 到 Facebook Developers > 您的應用程式 > 應用程式設定 > 基本資料
2. 隱私政策網址：`https://asia-east1-PROJECT_ID.cloudfunctions.net/bot/privacy`
3. 使用者資料刪除：`https://asia-east1-PROJECT_ID.cloudfunctions.net/bot/deletion`

## 🧪 測試部署

### 1. 測試隱私政策
在瀏覽器中訪問：
```
https://asia-east1-PROJECT_ID.cloudfunctions.net/bot/privacy
```

應該看到隱私政策頁面。

### 2. 測試 Webhook 驗證
```bash
curl "https://asia-east1-PROJECT_ID.cloudfunctions.net/bot?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=CHALLENGE_STRING"
```

應該返回 `CHALLENGE_STRING`。

## 📊 查看日誌

```bash
# 即時查看日誌
firebase functions:log --only bot

# 查看最近的日誌
firebase functions:log --only bot --lines 50
```

## 🔄 更新部署

當您修改程式碼後，重新部署：

```bash
firebase deploy --only functions
```

## ⚠️ 常見問題

### 問題 1: 環境變數未生效
**解決方法：**
```bash
# 重新設定環境變數
firebase functions:config:set facebook.page_access_token="YOUR_TOKEN"

# 重新部署
firebase deploy --only functions
```

### 問題 2: 部署失敗
**可能原因：**
- Node.js 版本不符（需要 Node 20）
- 依賴套件未安裝
- Firebase 專案權限問題

**解決方法：**
```bash
# 檢查 Node 版本
node --version  # 應該是 v20.x

# 清理並重新安裝
cd functions
rm -rf node_modules package-lock.json
npm install
cd ..

# 重新部署
firebase deploy --only functions
```

### 問題 3: Webhook 無法連接
**檢查清單：**
1. ✅ URL 是否正確
2. ✅ 驗證權杖是否一致
3. ✅ Facebook App 是否已發布
4. ✅ 頁面權限是否正確

## 💰 費用考量

Firebase Functions 免費方案包含：
- 每月 2,000,000 次調用
- 400,000 GB-秒的計算時間
- 200,000 GHz-秒的 CPU 時間
- 5GB 網路流出

一般使用情況下，免費方案已足夠。

## 🎯 下一步

1. ✅ 部署 Functions
2. ✅ 設定環境變數
3. ✅ 更新 Facebook Webhook URL
4. ✅ 更新隱私政策 URL
5. ✅ 測試完整流程
6. 📱 在粉絲頁測試留言功能

## 📚 參考資料

- [Firebase Functions 文件](https://firebase.google.com/docs/functions)
- [Facebook Webhooks 文件](https://developers.facebook.com/docs/graph-api/webhooks)
- [Firebase 定價](https://firebase.google.com/pricing)
