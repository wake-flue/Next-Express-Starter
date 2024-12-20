const config = require('../config');

const logger = config.logger;

const loggerMiddleware = (req, res, next) => {
  // 记录请求开始时间
  const start = new Date();
  
  // 请求结束时记录日志
  res.on('finish', () => {
    const duration = new Date() - start;
    
    // 构建请求信息
    const requestInfo = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      userAgent: req.get('user-agent') || '',
      ip: req.ip,
      host: req.get('host')
    };

    const message = `${requestInfo.method} ${requestInfo.url} ${requestInfo.status} ${requestInfo.duration}ms`;
    
    // 根据状态码选择日志级别
    const logData = {
      request: requestInfo,
      source: 'backend',
      metadata: {
        headers: req.headers,
        query: req.query,
        // 不记录敏感信息
        body: req.method === 'GET' ? undefined : '[FILTERED]'
      }
    };

    if (res.statusCode >= 500) {
      logger.error(message, { ...logData });
    } else if (res.statusCode >= 400) {
      logger.warn(message, { ...logData });
    } else {
      logger.http(message, { ...logData });
    }
  });

  next();
};

module.exports = loggerMiddleware; 