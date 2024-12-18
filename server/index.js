const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV || 'development'}`)
});
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const todosRouter = require('./routes/todos');
const serviceLogsRouter = require('./routes/service-logs');
const logger = require('./config/logger');
const loggerMiddleware = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3001;
const API_VERSION = process.env.API_VERSION || 'v1';

// 连接MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('MongoDB连接成功'))
  .catch(err => logger.error('MongoDB连接失败:', err));

// 中间件
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Swagger文档路由
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/v1/docs.json:
 *   get:
 *     summary: 获取Swagger API文档JSON
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: 返回完整的API文档JSON
 */
app.get(`/api/${API_VERSION}/docs.json`, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API v1 路由
app.use(`/api/${API_VERSION}/todos`, todosRouter);
app.use(`/api/${API_VERSION}/service-logs`, serviceLogsRouter);
  
// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
app.listen(PORT, () => {
  logger.info(`服务器运行在 http://localhost:${PORT}`);
  logger.info(`API文档地址: http://localhost:${PORT}/api-docs`);
}); 