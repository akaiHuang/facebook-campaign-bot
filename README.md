# Facebook Campaign Bot

## About

Facebook Campaign Bot 是一套 Facebook 粉專互動行銷自動化系統，涵蓋留言偵測、名單整理、抽獎與訊息回覆等流程。適合社群小編與活動營運用於降低人工操作成本，並把活動規則落地為可重複執行的機器流程。

## About (EN)

Facebook Campaign Bot automates Facebook Page campaign operations including comment capture, participant tracking, giveaway logic, and replies. It reduces manual operations for social teams and turns repeatable campaign rules into executable workflows.

## 📋 Quick Summary

> 🤖 **Facebook Campaign Bot** 是一套全自動化的 Facebook 粉絲專頁互動行銷與抽獎系統，從留言偵測、用戶追蹤到自動開獎與 Messenger 回覆，全程無需人工介入。🎯 透過 Facebook Webhooks 即時偵測活動貼文留言，支援關鍵字觸發（如「+1」、「參加」等可配置關鍵字）自動註冊參與者。🛡️ 內建完整防濫用機制：每用戶每貼文重複參與偵測、可配置領獎次數上限、留言驗證防止 Messenger 直接訊息攻擊、以及自我留言過濾防止機器人無限迴圈。🎁 透過 Facebook Graph API v18.0 自動發送個人化訊息與獎品圖片。🔥 完全建構於 Firebase 無伺服器架構（Cloud Functions Gen 2 + Firestore + Hosting），配備 Web 管理後台即時監控統計數據。📊 支援熱更新配置，部署後無需重啟即可調整活動參數。🎪 適合社群行銷人員、品牌活動策劃、粉絲互動經營等場景！

**Automated Fan Page Engagement and Lottery System**

A serverless automation system for running Facebook fan page campaigns -- from comment detection and user tracking to automated lottery draws and Messenger responses. Handles the repetitive mechanics of social campaigns so marketers can focus on creative strategy.

---

## 💡 Why This Exists

Running engagement campaigns on Facebook fan pages involves constant manual work: monitoring comments, tracking participants, verifying eligibility, drawing winners, and responding to users. This bot automates the entire lifecycle, running 24/7 on Firebase's serverless infrastructure with zero manual intervention once deployed.

## 🏗️ Architecture

```
Facebook Platform (Webhooks)
        |
        v
Firebase Cloud Functions (Gen 2)
        |
        +---> Comment Detection & Keyword Matching
        |         |
        |         v
        +---> Firestore Database
        |     (Users, Comments, Campaign Config)
        |         |
        |         v
        +---> Eligibility Engine
        |     (duplicate check, claim limits, abuse prevention)
        |         |
        |         v
        +---> Messenger Response
        |     (automated replies + image delivery via Graph API)
        |         |
        |         v
        +---> Admin Dashboard
              (real-time stats, config management)
```

### How It Works

1. **Webhook Listener** -- Facebook sends real-time webhook notifications to Firebase Cloud Functions whenever users comment on campaign posts.
2. **Comment Processing** -- Each comment is logged to Firestore with user ID, post ID, comment text, and timestamp. Keywords like "participate", "+1" trigger campaign enrollment.
3. **Abuse Prevention** -- Duplicate participation detection per user per post. Users must comment before they can claim prizes via Messenger (prevents direct-message abuse).
4. **Claim Limits** -- Configurable per-user claim caps (default: 2 claims per user). Automatic rejection with messaging on exceeded limits.
5. **Messenger Delivery** -- Uses Facebook Graph API v18.0 to send personalized messages and prize images via Messenger. Respects Facebook's 24-hour messaging window rules.
6. **Admin Dashboard** -- Web-based management interface at `/admin.html` for real-time statistics, keyword configuration, image URL management, and target post selection.

### Key Capabilities

- Real-time comment detection via Facebook Webhooks
- Keyword-based campaign enrollment (configurable: "+1", "participate", etc.)
- Per-user, per-post duplicate prevention
- Claim count limits with automatic enforcement
- Image prize delivery via Messenger
- Webhook signature verification (HMAC SHA256)
- Web admin dashboard with live statistics
- Firestore-backed configuration (hot-reloadable without redeployment)
- Self-comment filtering (prevents bot infinite loops)

## 🛠️ Tech Stack

- **Serverless Platform**: Firebase Cloud Functions (Gen 2)
- **Database**: Cloud Firestore
- **Hosting**: Firebase Hosting (admin dashboard)
- **Storage**: Firebase Storage (prize images)
- **API**: Facebook Graph API v18.0
- **Runtime**: Node.js 20
- **HTTP Client**: Axios
- **Security**: HMAC SHA256 webhook verification, Firestore security rules

## 🏁 Quick Start

### Prerequisites

- Node.js 20+
- Firebase CLI (`npm install -g firebase-tools`)
- A Facebook App with Webhooks and Messenger permissions
- Admin access to the target Facebook Fan Page

### Setup

```bash
# Install dependencies
npm install
cd functions && npm install

# Login to Firebase
firebase login

# Initialize project (if needed)
firebase init

# Deploy everything
firebase deploy
```

After deployment, you will receive:
- **Webhook URL**: `https://bot-xxxx.a.run.app/webhook`
- **Admin Dashboard**: `https://your-project.web.app/admin.html`

### Facebook Configuration

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Set up Webhook with your deployment URL
3. Subscribe to `feed` and `messages` events
4. Generate a Page Access Token with required permissions
5. Switch the app to **Live Mode** (Development mode does not receive comment events)

Detailed guides:
- **[FACEBOOK_APP_SETUP.md](./FACEBOOK_APP_SETUP.md)** -- Facebook App creation walkthrough
- **[FB_TOKEN_PERMISSIONS.md](./FB_TOKEN_PERMISSIONS.md)** -- Required token scopes and permissions
- **[FIRESTORE_SECURITY.md](./FIRESTORE_SECURITY.md)** -- Database security rules

### Campaign Flow

```
User comments "+1" on campaign post
        |
        v
Bot detects keyword --> Logs to Firestore --> Attempts Messenger reply
        |
        v
User sends "claim" via Messenger
        |
        v
Bot checks: commented? --> under claim limit? --> sends prize image
```

## 📁 Project Structure

```
facebook-campaign-bot/
  functions/
    index.js               # Core logic: webhooks, comment processing, messaging
    package.json           # Function dependencies
  public/
    admin.html             # Web-based admin dashboard
  firebase.json            # Firebase project configuration
  firestore.rules          # Firestore security rules
  storage.rules            # Storage security rules
  clear-comments.js        # Utility: reset test data
  test/                    # Test suite
  _archived/               # Previous versions (safe to remove)
  FACEBOOK_APP_SETUP.md    # Facebook App setup guide
  FB_TOKEN_PERMISSIONS.md  # Token permissions reference
  FIRESTORE_SECURITY.md    # Security rules documentation
```

---

Built by **Huang Akai (Kai)** -- Founder @ Universal FAW Labs | Creative Technologist | Ex-Ogilvy
