//===========================
// 依赖导入
//===========================
// 核心依赖
const express = require('express');
const cors = require('cors');

// Swagger文档
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// 自定义模块
const config = require('./config');
const LogHandler = require('./utils/logHandler');
const loggerMiddleware = require('./middleware/logger');
const {errorHandler, notFoundHandler} = require('./middleware/error');

//===========================
// 应用初始化
//===========================
const app = express();
const {port, apiVersion, corsOrigin} = config.app;

//===========================
// 数据库连接
//===========================
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

//===========================
// Swagger配置
//===========================
const swaggerSpec = swaggerJsdoc(config.swagger);

// Swagger路由
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get(`/api/${apiVersion}/docs.json`, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

//===========================
// 中间件注册
//===========================
// 通用中间件
app.use(cors({origin: corsOrigin}));
app.use(express.json());
app.use(loggerMiddleware);

//===========================
// API路由注册
//===========================
const todosRouter = require('./api/todos');
const logsRouter = require('./api/logs');

app.use(`/api/${apiVersion}/todos`, todosRouter);
app.use(`/api/${apiVersion}/logs`, logsRouter);

//===========================
// 错误处理
//===========================
app.use(errorHandler);  // 500错误处理
app.use(notFoundHandler);  // 404错误处理

//===========================
// 服务器启动
//===========================
app.listen(port, () => {
    LogHandler.info(`服务器启动成功\t访问地址：http://localhost:${port}/api/${apiVersion}\t文档地址：http://localhost:${port}/api-docs`, {
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