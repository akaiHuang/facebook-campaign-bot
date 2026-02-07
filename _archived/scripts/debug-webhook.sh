#!/bin/bash

PAGE_TOKEN=$(grep FACEBOOK_PAGE_ACCESS_TOKEN /Users/akaihuangm1/Desktop/fanpageBot/functions/.env.yaml | cut -d '"' -f2)

echo "🔍 完整診斷 Webhook 設定"
echo "================================"
echo ""

echo "1️⃣ 檢查訂閱狀態："
curl -s "https://graph.facebook.com/v18.0/me/subscribed_apps?access_token=${PAGE_TOKEN}" | python3 -m json.tool
echo ""
echo ""

echo "2️⃣ 檢查粉絲頁資訊："
curl -s "https://graph.facebook.com/v18.0/me?fields=id,name,access_token&access_token=${PAGE_TOKEN}" | python3 -m json.tool
echo ""
echo ""

echo "3️⃣ 檢查最近的留言（應該要能看到你的留言）："
curl -s "https://graph.facebook.com/v18.0/me/feed?fields=id,message,comments.limit(5){id,message,from}&limit=3&access_token=${PAGE_TOKEN}" | python3 -m json.tool
echo ""
echo ""

echo "================================"
