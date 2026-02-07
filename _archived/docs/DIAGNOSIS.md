# Facebook Webhook 問題診斷報告

## 當前狀況
❌ **Facebook 沒有發送真實的留言事件到 Webhook**

## 已確認正常的部分
✅ Webhook URL 可正常訪問
✅ Webhook 驗證成功（返回 challenge）
✅ 程式碼邏輯正確（手動測試成功）
✅ Page Access Token 有正確權限
✅ 粉絲頁已訂閱 App (subscribed_fields: feed, messages)
✅ Firebase Functions 部署成功

## 問題原因分析
**最可能的原因：App 需要 App Review 審核**

當 Facebook App 從「開發中」轉為「上線」後：
- `pages_read_engagement` 權限需要經過審核才能接收真實的 feed 事件
- 在審核通過前，只有 App 的測試用戶、開發者、管理員能觸發事件
- 即使粉絲頁管理員留言，如果不是 App 的測試用戶，也收不到事件

## 解決方案

### 方案 1：將 App 改回開發模式（推薦測試用）
1. 進入 Facebook Developer Console
2. 設定 → 基本資料
3. 將 App 模式改回「開發中」
4. 重新測試留言

### 方案 2：提交 App Review（正式上線用）
1. 進入 Facebook Developer Console
2. App 審查 → 權限和功能
3. 申請審核：
   - `pages_read_engagement` - 讀取粉絲頁互動內容
   - `pages_manage_metadata` - 管理粉絲頁中繼資料
4. 提供使用說明、示範影片
5. 等待 Meta 審核（通常 3-7 天）

### 方案 3：添加測試用戶
1. App 角色 → 測試用戶
2. 新增測試用戶
3. 用測試帳號在粉絲頁留言測試

## 立即行動建議
**請確認你的 App 目前的狀態：**
- 進入 https://developers.facebook.com/
- 選擇你的 App "Fanbot"
- 查看「設定 → 基本資料」中的「App 模式」
- 截圖給我看

如果是「上線」模式，建議先改回「開發中」模式測試！
