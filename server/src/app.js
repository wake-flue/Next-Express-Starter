const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const config = require('./config');
const loggerMiddleware = require('./middleware/logger');

const app = express();
const { port, apiVersion, corsOrigin } = config.app;

const logger = config.logger;

// 生成swagger文档
const swaggerSpec = swaggerJsdoc(config.swagger);

// 连接MongoDB
config.db.connectDB()
  .then(() => logger.info('MongoDB连接成功'))
  .catch(err => logger.error('MongoDB连接失败:', err));

// 中间件
app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use(loggerMiddleware);

// Swagger文档路由
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API路由
const todosRouter = require(path.join(__dirname, 'api', 'todos'));
const LogsRouter = require(path.join(__dirname, 'api', 'logs'));

/**
 * @swagger
 * /api/{version}/docs.json:
 *   get:
 *     summary: 获取API文档JSON
 *     tags: [Documentation]
 *     parameters:
 *       - in: path
 *         name: version
 *         required: true
 *         description: API版本
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功返回API文档
 */
app.get(`/api/${apiVersion}/docs.json`, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use(`/api/${apiVersion}/todos`, todosRouter);
app.use(`/api/${apiVersion}/logs`, LogsRouter);

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
app.listen(port, () => {
  logger.info(`服务器运行在 http://localhost:${port}`);
  logger.info(`API文档地址: http://localhost:${port}/api-docs`);
}); 