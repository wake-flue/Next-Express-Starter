const LogHandler = require('../utils/logHandler');

// 500错误处理中间件
const errorHandler = (err, req, res, next) => {
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
};

// 404错误处理中间件
const notFoundHandler = (req, res) => {
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
};

module.exports = {
  errorHandler,
  notFoundHandler
}; 