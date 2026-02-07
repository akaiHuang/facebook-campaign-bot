#!/bin/bash

echo "🔍 檢查 Facebook 訂閱狀態"
echo "================================"
echo ""

# 從 .env 讀取 Page Access Token
PAGE_TOKEN=$(grep FACEBOOK_PAGE_ACCESS_TOKEN /Users/akaihuangm1/Desktop/fanpageBot/.env | cut -d '=' -f2)

echo "📋 檢查粉絲頁訂閱的應用程式..."
echo ""

# 獲取粉絲頁 ID 和訂閱資訊
RESULT=$(curl -s "https://graph.facebook.com/v18.0/me/subscribed_apps?access_token=${PAGE_TOKEN}")

echo "$RESULT" | python3 -m json.tool 2>/dev/null || echo "$RESULT"

echo ""
echo "================================"
echo ""
echo "✅ 如果看到您的 App 和 subscribed_fields 包含 'feed'，表示設定正確"
echo "❌ 如果是空的或沒有 'feed'，需要重新訂閱"
