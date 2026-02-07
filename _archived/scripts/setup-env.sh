#!/bin/bash

# Firebase Functions 環境變數設定腳本

echo "🔧 Setting up Firebase Functions environment variables..."

# 從 .env 讀取變數
source .env

# 設定 Firebase Functions 環境變數
firebase functions:config:set \
  facebook.page_access_token="$FACEBOOK_PAGE_ACCESS_TOKEN" \
  facebook.verify_token="$FACEBOOK_VERIFY_TOKEN" \
  facebook.app_secret="$FACEBOOK_APP_SECRET" \
  bot.keywords="$KEYWORDS" \
  bot.image_urls="$IMAGE_URLS"

echo "✅ Environment variables configured!"
echo ""
echo "📋 Current configuration:"
firebase functions:config:get
