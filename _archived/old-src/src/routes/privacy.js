const express = require('express');
const router = express.Router();

/**
 * 隱私政策頁面
 * Facebook App 要求必須提供公開的隱私政策網址
 */
router.get('/policy', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-TW">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>隱私政策 - Facebook 粉絲頁機器人</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
          }
          h1 {
            color: #1877f2;
            border-bottom: 2px solid #1877f2;
            padding-bottom: 10px;
          }
          h2 {
            color: #444;
            margin-top: 30px;
          }
          .last-updated {
            color: #666;
            font-style: italic;
          }
          .section {
            margin: 20px 0;
          }
          ul {
            padding-left: 20px;
          }
          li {
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <h1>隱私政策</h1>
        <p class="last-updated">最後更新日期：2025年10月23日</p>
        
        <div class="section">
          <h2>1. 概述</h2>
          <p>
            本隱私政策說明我們的 Facebook 粉絲頁機器人（以下簡稱「本服務」）如何收集、使用和保護您的個人資訊。
            我們重視您的隱私權，並致力於保護您的個人資料。
          </p>
        </div>

        <div class="section">
          <h2>2. 我們收集的資訊</h2>
          <p>當您與我們的 Facebook 機器人互動時，我們可能會收集以下資訊：</p>
          <ul>
            <li><strong>Facebook 用戶 ID：</strong>用於識別和回應您的留言</li>
            <li><strong>留言內容：</strong>您在粉絲頁文章下的留言文字</li>
            <li><strong>留言時間：</strong>您留言的日期和時間</li>
            <li><strong>貼文 ID：</strong>您留言的文章 ID</li>
          </ul>
        </div>

        <div class="section">
          <h2>3. 資訊使用方式</h2>
          <p>我們收集的資訊僅用於以下目的：</p>
          <ul>
            <li>偵測和記錄符合特定關鍵字的留言</li>
            <li>自動回覆粉絲頁留言</li>
            <li>提供抽獎或活動管理功能</li>
            <li>改善服務品質和用戶體驗</li>
          </ul>
        </div>

        <div class="section">
          <h2>4. 資料儲存與安全</h2>
          <p>
            您的資料將安全地儲存在 Google Firebase Firestore 資料庫中。
            我們採取適當的技術和組織措施來保護您的個人資料，防止未經授權的訪問、洩露或破壞。
          </p>
        </div>

        <div class="section">
          <h2>5. 資料分享</h2>
          <p>
            我們不會將您的個人資訊出售、交易或轉讓給第三方。
            我們僅在以下情況下可能分享資訊：
          </p>
          <ul>
            <li>經您明確同意</li>
            <li>遵守法律要求或政府命令</li>
            <li>保護我們的權利和財產</li>
          </ul>
        </div>

        <div class="section">
          <h2>6. 您的權利</h2>
          <p>您擁有以下權利：</p>
          <ul>
            <li><strong>查看權：</strong>您有權查看我們持有的您的個人資料</li>
            <li><strong>更正權：</strong>您可以要求更正不正確的資料</li>
            <li><strong>刪除權：</strong>您可以要求刪除您的個人資料</li>
            <li><strong>撤回同意權：</strong>您可以隨時撤回對資料處理的同意</li>
          </ul>
        </div>

        <div class="section">
          <h2>7. 資料刪除</h2>
          <p>
            如果您希望刪除我們收集的您的個人資料，您可以：
          </p>
          <ul>
            <li>透過 Facebook 設定中的「應用程式和網站」選項移除本應用程式</li>
            <li>Facebook 將自動向我們發送資料刪除請求</li>
            <li>我們會在 30 天內完成資料刪除</li>
          </ul>
        </div>

        <div class="section">
          <h2>8. Cookie 和追蹤技術</h2>
          <p>
            本服務不使用 Cookie 或其他追蹤技術。
            我們僅透過 Facebook API 與您的留言互動。
          </p>
        </div>

        <div class="section">
          <h2>9. 兒童隱私</h2>
          <p>
            本服務不針對 13 歲以下的兒童。
            我們不會故意收集 13 歲以下兒童的個人資訊。
          </p>
        </div>

        <div class="section">
          <h2>10. 隱私政策變更</h2>
          <p>
            我們可能會不時更新本隱私政策。
            任何變更將在此頁面上發布，並更新「最後更新日期」。
            建議您定期查看本政策以了解最新資訊。
          </p>
        </div>

        <div class="section">
          <h2>11. 聯絡我們</h2>
          <p>
            如果您對本隱私政策有任何疑問或需要行使您的權利，請透過以下方式聯絡我們：
          </p>
          <ul>
            <li>電子郵件：[您的電子郵件]</li>
            <li>Facebook 粉絲頁：[您的粉絲頁]</li>
          </ul>
        </div>

        <div class="section">
          <h2>12. 適用法律</h2>
          <p>
            本隱私政策受中華民國法律管轄。
            任何爭議應由臺灣臺北地方法院管轄。
          </p>
        </div>

        <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">
        
        <div style="text-align: center; color: #666; font-size: 14px;">
          <p>© 2025 Facebook 粉絲頁機器人 | 保留所有權利</p>
        </div>
      </body>
    </html>
  `);
});

module.exports = router;
