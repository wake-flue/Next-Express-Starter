const LogHandler = require('../utils/logHandler');

const loggerMiddleware = (req, res, next) => {
  const start = new Date();
  
  res.on('finish', () => {
    const duration = new Date() - start;
    
    const requestInfo = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      userAgent: req.get('user-agent') || '',
      ip: req.ip,
      host: req.get('host')
    };

    const metadata = {
      headers: req.headers,
      query: req.query,
      // 不记录敏感信息
      body: req.method === 'GET' ? undefined : '[FILTERED]'
    };

    LogHandler.logRequest(requestInfo, metadata);
  });

  next();
};

module.exports = loggerMiddleware; 