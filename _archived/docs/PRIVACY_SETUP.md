# 隱私政策設定指南

## ✅ 已完成的設定

我已經為您的 Facebook 機器人建立了隱私政策頁面，現在您可以獲得隱私政策網址了。

## 📍 隱私政策網址

### 本地測試環境
```
http://localhost:3000/privacy/policy
```

### 正式環境（需要部署後）
當您將應用程式部署到線上伺服器後，網址會是：
```
https://你的網域/privacy/policy
```

## 🔧 如何使用這些網址

### 1. Facebook App 設定
登入 [Facebook Developers](https://developers.facebook.com/)，進入您的應用程式設定：

#### 在「應用程式設定」→「基本資料」中：
- **隱私政策網址**：`https://你的網域/privacy/policy`
- **使用者資料刪除**：`https://你的網域/data/deletion`

### 2. 測試隱私政策頁面

啟動伺服器後，在瀏覽器中訪問：
```bash
# 啟動伺服器
npm start

# 然後在瀏覽器打開
http://localhost:3000/privacy/policy
```

您應該會看到一個完整的隱私政策頁面。

## 📝 需要自訂的內容

在 `src/routes/privacy.js` 中，請更新以下資訊：

1. **聯絡資訊**（第 109-112 行）：
   ```html
   <li>電子郵件：[您的電子郵件]</li>
   <li>Facebook 粉絲頁：[您的粉絲頁]</li>
   ```
   
   改為您實際的聯絡方式。

2. **最後更新日期**（如需要）：
   ```html
   <p class="last-updated">最後更新日期：2025年10月23日</p>
   ```

## 🚀 部署到線上伺服器

要讓 Facebook 能訪問您的隱私政策，您需要：

### 選項 1：使用 ngrok（臨時測試）
```bash
# 安裝 ngrok
brew install ngrok

# 啟動您的伺服器
npm start

# 在另一個終端機視窗
ngrok http 3000
```

然後使用 ngrok 提供的 HTTPS 網址（例如：`https://abc123.ngrok.io/privacy/policy`）

### 選項 2：部署到雲端平台（正式環境）

#### Render.com（推薦，免費）
1. 到 [Render.com](https://render.com/) 註冊
2. 連接您的 GitHub repository
3. 建立新的 Web Service
4. 設定環境變數（從 .env 複製）
5. 部署後會得到一個 HTTPS 網址

#### Heroku
```bash
heroku create your-app-name
git push heroku main
```

#### Google Cloud Run / AWS / Azure
也都可以部署 Node.js 應用程式

## 📋 檢查清單

- [x] 建立隱私政策頁面
- [x] 新增路由到應用程式
- [ ] 更新聯絡資訊
- [ ] 部署到線上伺服器
- [ ] 在 Facebook App 設定中填入網址
- [ ] 測試網址是否可正常訪問
- [ ] 提交 Facebook 審核（如需要）

## 🔗 相關網址

您的應用程式現在有以下端點：

| 端點 | 網址 | 用途 |
|------|------|------|
| 首頁 | `/` | 健康檢查 |
| Webhook | `/webhook` | Facebook 訊息接收 |
| 隱私政策 | `/privacy/policy` | 給 Facebook App 設定用 |
| 資料刪除 | `/data/deletion` | 處理使用者資料刪除請求 |
| 刪除狀態 | `/data/deletion/status` | 查詢刪除狀態 |

## 📚 參考資料

- [Facebook Platform Policy](https://developers.facebook.com/docs/development/release/policies/platform-terms)
- [Facebook 隱私政策要求](https://developers.facebook.com/docs/apps/review/supplemental-terms/)
- [個人資料保護法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=I0050021)

## 💡 提示

1. **本地測試時**，Facebook 無法訪問 localhost，需要使用 ngrok 或直接部署
2. **隱私政策必須是 HTTPS**（除了本地測試）
3. **內容要符合實際使用情況**，不要誇大或隱瞞資料收集方式
4. **定期檢查並更新**隱私政策，特別是當功能改變時

## ❓ 常見問題

**Q: Facebook 審核被拒絕，說找不到隱私政策？**
A: 確認網址是 HTTPS 且可公開訪問，不需要登入。

**Q: 可以使用 Google Docs 或其他平台的隱私政策嗎？**
A: 可以，只要是公開可訪問的網址即可。

**Q: 隱私政策需要包含什麼內容？**
A: 至少要說明收集什麼資料、如何使用、如何刪除。我提供的範本已經包含了。

**Q: 需要律師審核嗎？**
A: 對於商業應用，建議請法律專業人士審核。對於個人專案，範本已經涵蓋基本要求。
