const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const config = require('./config');
const loggerMiddleware = require('./middleware/logger');
const LogHandler = require('./utils/logHandler');

const app = express();
const { port, apiVersion, corsOrigin } = config.app;

// 生成swagger文档
const swaggerSpec = swaggerJsdoc(config.swagger);

// 连接MongoDB
config.db.connectDB()
  .then(() => {
    LogHandler.info('MongoDB连接成功', {
      operation: 'DB_CONNECT',
      database: 'MongoDB',
      status: 'success'
    });
  })
  .catch(err => {
    LogHandler.error('MongoDB连接失败', {
      operation: 'DB_CONNECT',
      database: 'MongoDB',
      status: 'failed',
      error: err
    });
  });

// 中间件
app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use(loggerMiddleware);

// Swagger文档路由
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API路由
const todosRouter = require('./api/todos');
const logsRouter = require('./api/logs');

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

// 注册路由
app.use(`/api/${apiVersion}/todos`, todosRouter);
app.use(`/api/${apiVersion}/logs`, logsRouter);

// 错误处理中间件
app.use((err, req, res, next) => {
  LogHandler.error('服务器错误', {
    operation: 'ERROR_HANDLER',
    error: err,
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.method === 'GET' ? undefined : req.body
  });
  
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : '服务器内部错误'
  });
});

// 404处理
app.use((req, res) => {
  LogHandler.warn('路由未找到', {
    operation: 'NOT_FOUND',
    path: req.path,
    method: req.method,
    query: req.query
  });
  
  res.status(404).json({
    success: false,
    error: '请求的资源不存在'
  });
});

// 启动服务器
app.listen(port, () => {
  LogHandler.info('服务器启动成功', {
    operation: 'SERVER_START',
    port,
    environment: process.env.NODE_ENV,
    apiVersion,
    urls: {
      api: `http://localhost:${port}/api/${apiVersion}`,
      docs: `http://localhost:${port}/api-docs`
    }
  });
}); 