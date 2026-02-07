require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const webhookRouter = require('./routes/webhook');
const { initializeFirebase } = require('./config/firebase');

const app = express();
const PORT = process.env.PORT || 3000;

// 初始化 Firebase
initializeFirebase();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 路由
app.use('/webhook', webhookRouter);
const dataDeletionRouter = require('./routes/dataDeletion');
app.use('/data', dataDeletionRouter);
const privacyRouter = require('./routes/privacy');
app.use('/privacy', privacyRouter);

// 健康檢查路由
app.get('/', (req, res) => {
  res.send('Facebook Fanpage Bot is running! 🤖');
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Webhook URL: http://localhost:${PORT}/webhook`);
});

module.exports = app;
