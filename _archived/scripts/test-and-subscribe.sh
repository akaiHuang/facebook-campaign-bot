#!/bin/bash

echo "🔍 測試新的 Page Access Token..."
echo "================================"
echo ""

# 從 .env.yaml 讀取新 Token
PAGE_TOKEN=$(grep FACEBOOK_PAGE_ACCESS_TOKEN /Users/akaihuangm1/Desktop/fanpageBot/functions/.env.yaml | cut -d '"' -f2)

echo "1️⃣ 檢查目前訂閱狀態..."
curl -s "https://graph.facebook.com/v18.0/me/subscribed_apps?access_token=${PAGE_TOKEN}" | python3 -m json.tool
echo ""
echo ""

echo "2️⃣ 訂閱粉絲頁到 Webhook（feed + messages）..."
RESULT=$(curl -s -X POST "https://graph.facebook.com/v18.0/me/subscribed_apps?subscribed_fields=feed,messages&access_token=${PAGE_TOKEN}")
echo "$RESULT" | python3 -m json.tool
echo ""
echo ""

echo "3️⃣ 再次檢查訂閱狀態..."
curl -s "https://graph.facebook.com/v18.0/me/subscribed_apps?access_token=${PAGE_TOKEN}" | python3 -m json.tool
echo ""
echo ""

echo "================================"
echo "✅ 如果看到 success: true 和 subscribed_fields 包含 feed，表示成功！"
