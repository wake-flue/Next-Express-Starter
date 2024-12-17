const logger = require('../config/logger');

const loggerMiddleware = (req, res, next) => {
  // 记录请求开始时间
  const start = new Date();
  
  // 请求结束时记录日志
  res.on('finish', () => {
    const duration = new Date() - start;
    const log = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent') || '',
      ip: req.ip,
    };

    const message = `${log.method} ${log.url} ${log.status} ${log.duration}`;
    
    // 根据状态码选择日志级别
    if (res.statusCode >= 500) {
      logger.error(message, log);
    } else if (res.statusCode >= 400) {
      logger.warn(message, log);
    } else {
      logger.http(message, log);
    }
  });

  next();
};

module.exports = loggerMiddleware; 