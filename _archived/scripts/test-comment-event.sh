#!/bin/bash

echo "🧪 發送測試留言事件到 Firebase Function..."
echo "================================"
echo ""

# 模擬 Facebook 發送的留言事件
curl -X POST https://bot-f73xf642oq-de.a.run.app/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "page",
    "entry": [
      {
        "id": "261205178149570",
        "time": 1234567890,
        "changes": [
          {
            "field": "feed",
            "value": {
              "item": "comment",
              "verb": "add",
              "post_id": "261205178149570_test123",
              "comment_id": "test_comment_456",
              "message": "抽獎",
              "from": {
                "id": "123456789",
                "name": "Test User"
              },
              "created_time": 1234567890
            }
          }
        ]
      }
    ]
  }'

echo ""
echo ""
echo "================================"
echo "✅ 測試事件已發送！"
echo "現在執行: firebase functions:log --only bot --lines 20"
