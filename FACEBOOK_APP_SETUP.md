# Facebook App 設定指南

## 🎯 設定流程圖

```
1. 準備 Firebase 環境
   ↓
   - 安裝套件
   - 設定 serviceAccountKey.json
   
2. 部署 Functions（使用臨時 Token）
   ↓
   - 取得 Webhook URL
   - 記下這個 URL！
   
3. 建立 Facebook App
   ↓
   - 新增 Messenger 產品
   
4. 設定必要權限
   ↓
   - pages_messaging
   - pages_read_engagement
   - pages_show_list 等
   
5. 設定 Webhook
   ↓
   - 使用步驟 2 的 URL
   - 填入 verify token
   - 訂閱粉絲專頁
   
6. 取得 Page Access Token
   ↓
   - 從 Graph API Explorer
   - 延長為永久 Token
   
7. 回填 Token 到程式碼
   ↓
   - 更新 functions/index.js
   - 更新 public/admin.html
   
8. 重新部署並測試
   ↓
   - 測試留言功能
   - 測試私訊功能
   ✅ 完成！
```

---

## 📋 正確的設定順序

⚠️ **重要**：必須按照以下順序進行設定

1. [準備 Firebase 環境](#1️⃣-準備-firebase-環境)（先做）
2. [部署 Functions 取得 Webhook URL](#2️⃣-部署-functions-取得-webhook-url)（先做）
3. [建立 Facebook App](#3️⃣-建立-facebook-app)
4. [設定必要權限](#4️⃣-設定必要權限)
5. [設定 Webhook](#5️⃣-設定-webhook)
6. [取得 Page Access Token](#6️⃣-取得-page-access-token)
7. [回填 Token 到程式碼](#7️⃣-回填-token-到程式碼)
8. [重新部署並測試](#8️⃣-重新部署並測試)

---

## 1️⃣ 準備 Firebase 環境

### 步驟 1: 安裝相關套件
```bash
npm install
cd functions
npm install
cd ..
```

### 步驟 2: 設定 Firebase
```bash
# 登入 Firebase
firebase login

# 初始化專案（如果尚未初始化）
firebase init
```

選擇：
- ✅ Firestore
- ✅ Functions
- ✅ Hosting

### 步驟 3: 設定 serviceAccountKey.json
1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇你的專案
3. 點擊「專案設定」→「服務帳戶」
4. 點擊「產生新的私密金鑰」
5. 下載 JSON 檔案並重新命名為 `serviceAccountKey.json`
6. 放在專案根目錄

---

## 2️⃣ 部署 Functions 取得 Webhook URL

### 步驟 1: 先用臨時 Token 部署
在 `functions/index.js` 第 688-690 行，先填入臨時值：

```javascript
const pageAccessToken = 'TEMP_TOKEN_WILL_UPDATE_LATER';  // 臨時值
const verifyToken = 'my_verify_token_123';                // 你自己設定的驗證 token
const pageId = 'YOUR_PAGE_ID';                            // 你的粉絲專頁 ID
```

### 步驟 2: 部署 Functions
```bash
firebase deploy --only functions
```

### 步驟 3: 記下 Webhook URL
部署完成後會顯示 Function URL，例如：
```
Function URL (bot): https://bot-f73xf642oq-de.a.run.app
```

**📝 記下這個 URL！稍後設定 Facebook Webhook 時會用到**

---

## 3️⃣ 建立 Facebook App

### 步驟 1: 前往 Facebook Developers
1. 開啟 [Facebook for Developers](https://developers.facebook.com/)
2. 登入你的 Facebook 帳號
3. 點擊右上角「我的應用程式」→「建立應用程式」

### 步驟 2: 選擇應用程式類型
- 選擇：**其他**
- 點擊「下一步」

### 步驟 3: 選擇使用案例
- 選擇：**商業**
- 點擊「下一步」

### 步驟 4: 填寫應用程式資訊
```
應用程式名稱：Fanbot（或你想要的名稱）
應用程式聯絡電郵：你的電子郵件
商業帳號：選擇你的商業帳號（如果有）
```

### 步驟 5: 建立應用程式
- 點擊「建立應用程式」
- 完成安全驗證（可能需要輸入密碼）

---

## 4️⃣ 設定必要權限

### 步驟 1: 新增 Messenger 產品
1. 在左側選單找到「新增產品」
2. 找到「Messenger」
3. 點擊「設定」

### 步驟 2: 前往 Graph API Explorer
1. 開啟 [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. 在右上角下拉選單選擇你剛建立的應用程式

### 步驟 3: 選擇必要權限
點擊「Permissions」旁的「新增權限」，勾選以下權限：

#### ✅ 必要權限（核心功能）
```
pages_messaging                  - 發送和接收訊息
pages_read_engagement           - 讀取留言、按讚等互動
pages_manage_engagement         - 管理留言、回覆留言
pages_show_list                 - 列出管理的粉絲專頁
pages_read_user_content         - 讀取用戶在粉絲專頁的內容
```

#### 🔧 進階權限（建議開啟）
```
pages_manage_metadata           - 管理粉絲專頁中繼資料
pages_utility_messaging         - 訊息工具（提升穩定性）
```

#### ❌ 不需要的權限
```
pages_manage_posts              - 不需要（我們不發佈貼文）
pages_manage_ads                - 不需要（不涉及廣告）
```

### 步驟 4: 生成 Access Token
1. 點擊「Generate Access Token」
2. 選擇你要管理的粉絲專頁
3. 授權所有勾選的權限
4. 複製生成的 Token（稍後會用到）

---

## 5️⃣ 設定 Webhook

### 步驟 1: 使用之前部署的 Function URL
使用在步驟 2 中取得的 URL：
```
https://bot-xxxxxxxx-xx.a.run.app
```

### 步驟 2: 在 Facebook App 中設定 Webhook
1. 回到 Facebook App 控制台
2. 左側選單：「Messenger」→「設定」
3. 找到「Webhooks」區塊
4. 點擊「新增回呼網址」

### 步驟 3: 填寫 Webhook 資訊
```
回呼網址：https://bot-xxxxxxxx-xx.a.run.app
驗證權杖：my_verify_token_123
```
（驗證權杖必須與 `functions/index.js` 第 689 行的 `verifyToken` 一致）

### 步驟 4: 訂閱事件
勾選以下 Webhook 欄位：
```
✅ messages                    - 接收私訊
✅ messaging_postbacks         - 按鈕點擊事件
✅ feed                        - 貼文更新（包含留言）
```

### 步驟 5: 訂閱粉絲專頁
1. 在「Webhooks」下方找到「將你的粉絲專頁訂閱至這個應用程式」
2. 選擇你的粉絲專頁
3. 點擊「訂閱」

---

## 6️⃣ 取得 Page Access Token

### 方法 1: 使用 Graph API Explorer（測試用）
1. 開啟 [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. 選擇你的應用程式
3. 選擇「取得粉絲專頁存取權杖」
4. 選擇你的粉絲專頁
5. 複製 Token

⚠️ **注意**：這個 Token 可能會過期，適合測試使用

### 方法 2: 取得永久 Token（正式使用）
1. 使用 Graph API Explorer 生成 Token（如上）
2. 前往 [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)
3. 貼上你的 Token
4. 點擊「延長存取權杖」
5. 複製延長後的 Token（通常是永久有效的 Page Token）

### 驗證 Token 權限
在 Graph API Explorer 執行：
```
GET /me/permissions
```
確認包含所有必要權限

---

## 7️⃣ 回填 Token 到程式碼

### 步驟 1: 取得必要資訊
你現在已經有：
1. ✅ **Page Access Token**：從步驟 6 取得
2. ✅ **粉絲專頁 ID**：在粉絲專頁「關於」頁面找到
3. ✅ **Verify Token**：`my_verify_token_123`（步驟 2 設定的）

### 步驟 2: 更新 `functions/index.js`
找到第 688-690 行，更新為你的真實資訊：

```javascript
const pageAccessToken = 'EAAxxxxxxxxxxxxx...';  // 步驟 6 取得的真實 Token
const verifyToken = 'my_verify_token_123';       // 與步驟 5 Webhook 設定一致
const pageId = '261205178149570';                // 你的真實粉絲專頁 ID
```

### 步驟 3: 更新 `public/admin.html`
找到第 638-639 行，同樣更新：

```javascript
const PAGE_ACCESS_TOKEN = 'EAAxxxxxxxxxxxxx...';  // 你的 Page Access Token
const FACEBOOK_PAGE_ID = '261205178149570';       // 你的粉絲專頁 ID
```

⚠️ **注意**：兩個檔案的 Token 和 Page ID 必須一致！

---

## 8️⃣ 重新部署並測試

### 步驟 1: 測試 Token
執行測試腳本確認 Token 有效：
```bash
node test/quick-test-token.js
```

應該看到：
```
✅ 成功！獲取到 5 則貼文
✅ Token 有效！可以使用這個 token 獲取貼文清單
```

### 步驟 2: 重新部署
```bash
firebase deploy --only functions,hosting
```

### 步驟 3: 測試 Webhook
1. 到你的 Facebook 粉絲專頁發布一則測試貼文
2. 在貼文下方留言測試關鍵字（例如：「香蕉」）
3. 查看 Firebase Functions 日誌：
```bash
firebase functions:log --only bot
```

### 步驟 4: 測試私訊功能
1. 對粉絲專頁發送私訊「領取」
2. 應該收到機器人回覆的圖片

---

## 🔧 常見問題

### Q1: Token 驗證失敗
**錯誤**: `Error validating access token`

**解決方案**:
1. 確認 Token 是 **Page Access Token**（不是 User Token）
2. 重新生成 Token 並延長有效期
3. 確認粉絲專頁 ID 正確

### Q2: Webhook 驗證失敗
**錯誤**: `The URL couldn't be validated`

**解決方案**:
1. 確認 Function URL 正確（包含 https://）
2. 確認 `verifyToken` 與設定的一致
3. 檢查 Functions 是否正確部署
4. 查看 Functions 日誌排查錯誤

### Q3: 收不到留言通知
**可能原因**:
1. Webhook 欄位未勾選 `feed`
2. 粉絲專頁未訂閱到應用程式
3. 貼文 ID 不在監控清單中

**解決方案**:
1. 檢查 Webhook 訂閱設定
2. 重新訂閱粉絲專頁
3. 到後台檢查監控的貼文 ID

### Q4: 權限不足
**錯誤**: `(#200) Requires pages_read_engagement permission`

**解決方案**:
1. 回到 Graph API Explorer
2. 確認勾選所有必要權限
3. 重新生成 Token
4. 更新程式碼中的 Token

---

## 📚 相關連結

- [Facebook Developers Console](https://developers.facebook.com/)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)
- [Messenger Platform 文檔](https://developers.facebook.com/docs/messenger-platform)
- [Graph API 文檔](https://developers.facebook.com/docs/graph-api)

---

## 🎯 完整設定檢查清單

在上線前確認以下項目：

- [ ] Facebook App 已建立
- [ ] Messenger 產品已新增
- [ ] 必要權限已勾選並授權
- [ ] Page Access Token 已取得（最好是永久 Token）
- [ ] Webhook 已設定並驗證成功
- [ ] 粉絲專頁已訂閱到應用程式
- [ ] `functions/index.js` 中的 Token 和 Page ID 已更新
- [ ] `public/admin.html` 中的 Token 和 Page ID 已更新
- [ ] Firebase Functions 已部署
- [ ] Token 測試通過
- [ ] Webhook 留言測試通過
- [ ] 私訊功能測試通過
- [ ] Firestore 規則已設定（如需後台存取）

---

## ⚠️ 安全提醒

1. **不要將 Token 提交到公開的 Git 儲存庫**
2. **定期更換 Token**（建議 3-6 個月）
3. **生產環境使用 Firebase Secrets** 而非硬編碼
4. **限制 Firestore 規則**（目前是開放模式，僅適合測試）
5. **監控 Functions 使用量**避免超額費用

---

## 🚀 進階設定（可選）

### 使用 Firebase Secrets 管理 Token
```bash
# 設定 Secret
firebase functions:secrets:set PAGE_ACCESS_TOKEN

# 在 Functions 中使用
const {defineSecret} = require('firebase-functions/params');
const pageAccessToken = defineSecret('PAGE_ACCESS_TOKEN');
```

### 設定 Firestore 安全規則
參考 `FIRESTORE_SECURITY.md` 設定適當的存取權限

### 設定 App 審查
如果要正式上線，需要提交 App 審查：
1. 前往「App 審查」→「權限和功能」
2. 提交需要的進階權限
3. 準備審查資料（影片、說明文件等）

---

**祝你設定順利！🎉**

如有問題，請參考 `README.md` 或 `TROUBLESHOOTING.md`
