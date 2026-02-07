#!/bin/bash

# Facebook 粉絲頁機器人 - 快速測試腳本

echo "╔═══════════════════════════════════════════════════╗"
echo "║   🤖 Facebook 粉絲頁機器人測試工具              ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# 設定顏色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BOT_URL="https://asia-east1-fanbot-b8f92.cloudfunctions.net/bot"
VERIFY_TOKEN="my_verify_token_123"

echo -e "${BLUE}🔍 測試項目：${NC}"
echo "1. Webhook 驗證"
echo "2. 隱私政策頁面"
echo "3. 資料刪除頁面"
echo "4. 機器人狀態"
echo "5. 查看日誌"
echo ""

# 測試 1: Webhook 驗證
echo -e "${YELLOW}測試 1/5: Webhook 驗證${NC}"
RESULT=$(curl -s "${BOT_URL}?hub.mode=subscribe&hub.verify_token=${VERIFY_TOKEN}&hub.challenge=TEST123")
if [ "$RESULT" = "TEST123" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Webhook 驗證成功"
else
    echo -e "${RED}❌ FAIL${NC} - Webhook 驗證失敗"
fi
echo ""

# 測試 2: 隱私政策頁面
echo -e "${YELLOW}測試 2/5: 隱私政策頁面${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BOT_URL}/privacy")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} - 隱私政策頁面正常 (HTTP $HTTP_CODE)"
else
    echo -e "${RED}❌ FAIL${NC} - 隱私政策頁面異常 (HTTP $HTTP_CODE)"
fi
echo ""

# 測試 3: 資料刪除頁面
echo -e "${YELLOW}測試 3/5: 資料刪除頁面${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BOT_URL}/deletion/status?id=test")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} - 資料刪除頁面正常 (HTTP $HTTP_CODE)"
else
    echo -e "${RED}❌ FAIL${NC} - 資料刪除頁面異常 (HTTP $HTTP_CODE)"
fi
echo ""

# 測試 4: 機器人基本連線
echo -e "${YELLOW}測試 4/5: 機器人連線狀態${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BOT_URL}")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "400" ]; then
    echo -e "${GREEN}✅ PASS${NC} - 機器人正常運作 (HTTP $HTTP_CODE)"
else
    echo -e "${RED}❌ FAIL${NC} - 機器人連線異常 (HTTP $HTTP_CODE)"
fi
echo ""

# 測試 5: 查看最新日誌
echo -e "${YELLOW}測試 5/5: 查看最新日誌${NC}"
echo -e "${BLUE}最近 10 筆日誌：${NC}"
firebase functions:log --only bot --lines 10 2>/dev/null || echo "無法取得日誌（請確認已安裝 Firebase CLI）"
echo ""

echo "╔═══════════════════════════════════════════════════╗"
echo "║             📝 下一步測試建議                     ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""
echo "✨ 系統測試完成！現在請進行實際功能測試："
echo ""
echo "1️⃣  前往您的 Facebook 粉絲頁"
echo "2️⃣  發布一篇新貼文"
echo "3️⃣  在貼文下留言包含關鍵字："
echo "    • 抽獎"
echo "    • 參加"
echo "    • +1"
echo "    • 我要"
echo "4️⃣  檢查您的 Messenger 是否收到私訊"
echo "5️⃣  再次執行此腳本查看日誌更新"
echo ""
echo -e "${GREEN}🎉 如果收到私訊和圖片，恭喜！機器人運作正常！${NC}"
echo ""
