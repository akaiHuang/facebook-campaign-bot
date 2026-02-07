# Firestore 安全規則說明

## ⚠️ 當前規則（開發/測試用）

目前的 Firestore 規則允許**任何人讀寫**，這是為了方便開發和測試。

```javascript
// 當前規則：允許所有讀寫
match /config/{document=**} {
  allow read: if true;
  allow write: if true;
}
```

## 🔒 生產環境建議規則

### 選項 1：使用 Firebase Authentication

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // 配置：只有管理員可以寫入
    match /config/{document=**} {
      allow read: if true;  // 任何人可讀
      allow write: if request.auth != null && 
                      request.auth.token.email == 'admin@yourdomain.com';
    }
    
    // 留言記錄：只有認證用戶可讀
    match /comments/{document=**} {
      allow read: if request.auth != null;
      allow write: if false;  // 只有 Functions 可寫
    }
    
    // 用戶資料：只有本人可讀
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false;  // 只有 Functions 可寫
    }
  }
}
```

### 選項 2：使用 API Key 驗證（在 admin.html 中）

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // 配置：需要特定的管理 token
    match /config/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    // 其他集合：只允許 Functions 訪問
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 選項 3：限制來源（最簡單）

在 Firebase Console 中設定：
1. 前往 **Firestore Database** → **Rules**
2. 使用 IP 白名單或 Firebase App Check

## 🚀 如何套用生產規則

### 步驟 1：設定 Firebase Authentication

```bash
# 1. 在 Firebase Console 啟用 Email/Password 認證
# 2. 創建管理員帳號
# 3. 更新 firestore.rules 使用選項 1
```

### 步驟 2：更新 admin.html

在 `public/admin.html` 中加入登入功能：

```javascript
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();

// 登入函數
async function adminLogin(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log('管理員登入成功');
  } catch (error) {
    console.error('登入失敗:', error);
  }
}
```

### 步驟 3：部署新規則

```bash
firebase deploy --only firestore:rules
```

## 📊 目前風險評估

| 風險 | 等級 | 說明 | 建議 |
|------|------|------|------|
| 任何人可讀取配置 | 🟡 中 | 圖片 URL 和關鍵字可能被看到 | 如果不包含敏感資料，可接受 |
| 任何人可修改配置 | 🔴 高 | 惡意用戶可以修改設定 | **建議盡快加上驗證** |
| 任何人可讀取用戶資料 | 🟡 中 | 用戶名稱和統計數據可能被看到 | 考慮加上認證 |

## 💡 快速修正方案

如果你想要立即提升安全性，但不想設定登入系統：

### 方案：限制寫入，開放讀取

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // 配置：所有人可讀，但不能寫（從 Firebase Console 手動修改）
    match /config/{document=**} {
      allow read: if true;
      allow write: if false;  // ✅ 阻止惡意修改
    }
    
    // 統計數據：可讀但不能寫
    match /comments/{document=**} {
      allow read: if true;
      allow write: if false;  // 只有 Functions 可寫
    }
    
    match /users/{document=**} {
      allow read: if true;
      allow write: if false;  // 只有 Functions 可寫
    }
  }
}
```

這樣的話：
- ✅ 後台可以顯示統計數據
- ✅ 後台可以讀取配置
- ❌ 後台無法修改配置（需從 Firebase Console 修改）
- ✅ 防止惡意用戶修改設定

## 🔧 套用建議

執行以下命令套用更安全的規則：

```bash
# 1. 編輯 firestore.rules（使用上面的快速修正方案）
nano firestore.rules

# 2. 部署
firebase deploy --only firestore:rules
```

## ⚠️ 注意事項

1. **目前的規則僅適合測試環境**
2. **生產環境強烈建議加上認證**
3. **定期檢查 Firebase Console 的安全警告**
4. **考慮使用 Firebase App Check 防止濫用**

## 📚 參考資源

- [Firebase Security Rules 文檔](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication 指南](https://firebase.google.com/docs/auth)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
