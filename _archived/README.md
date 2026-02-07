# 封存檔案說明

此資料夾包含專案開發過程中產生的舊檔案、測試腳本和文檔。這些檔案目前不再使用，但保留作為參考。

## 資料夾結構

### 📁 docs/
開發和部署過程中的文檔記錄：
- `DEPLOYMENT_SUCCESS.md` - 部署成功記錄
- `DIAGNOSIS.md` - 問題診斷記錄
- `FIREBASE_DEPLOY_GUIDE.md` - Firebase 部署指南
- `PRIVACY_SETUP.md` - 隱私政策設定
- `TESTING_GUIDE.md` - 測試指南
- `TESTING_PRODUCTION.md` - 生產環境測試
- `WEBHOOK_SETUP_CHECKLIST.md` - Webhook 設定檢查清單
- `WEBHOOK_TROUBLESHOOTING.md` - Webhook 疑難排解

### 📁 scripts/
測試和部署使用的腳本：
- `check-subscription.sh` - 檢查 Webhook 訂閱狀態
- `debug-webhook.sh` - Webhook 除錯腳本
- `setup-env.sh` - 環境變數設定
- `test-and-subscribe.sh` - 測試並訂閱 Webhook
- `test-comment-event.sh` - 測試留言事件
- `test-production.sh` - 生產環境測試
- `test-firebase.js` - Firebase 連線測試
- `get-post-id.js` - 取得貼文 ID
- `upload-images.js` - 圖片上傳到 Firebase Storage
- `upload-to-imgur.js` - 圖片上傳到 Imgur

### 📁 old-src/
舊版本的原始碼（已被 `functions/index.js` 取代）：
- `src/index.js` - 舊版主程式
- `src/config/` - 舊版設定檔
- `src/routes/` - 舊版路由
- `src/services/` - 舊版服務

### 📁 其他檔案
- `.env` - 舊的環境變數檔（已改用硬編碼）
- `.env.example` - 環境變數範例
- `img/` - 舊的圖片資料夾（已上傳到 Firebase Storage）
- `pglite-debug.log` - 除錯日誌

## 目前使用的檔案

專案目前實際使用的檔案在根目錄：
- `functions/index.js` - **核心程式碼**（唯一的業務邏輯檔案）
- `public/admin.html` - 後台管理介面
- `clear-comments.js` - 資料庫清空工具
- `firebase.json` - Firebase 配置
- `storage.rules` - Storage 安全規則
- `serviceAccountKey.json` - Firebase 服務帳號金鑰
- `README.md` - 專案說明
- `package.json` - 專案依賴

## 注意事項

⚠️ 這些封存檔案可以安全刪除，但建議保留作為開發歷史參考。

如需復原任何檔案，可以：
1. 從此資料夾複製回根目錄
2. 或從 Git 歷史記錄中復原
