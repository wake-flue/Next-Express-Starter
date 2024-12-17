const winston = require('winston');
require('winston-mongodb');
const path = require('path');

// 定义日志级别
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 根据环境选择日志级别
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

// 自定义日志颜色
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// 控制台日志格式
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// MongoDB日志格式
const mongoFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.uncolorize(),
  winston.format.json()
);

// 定义日志传输目标
const transports = [
  // 控制台输出
  new winston.transports.Console({
    format: consoleFormat
  }),
  
  // MongoDB 存储
  new winston.transports.MongoDB({
    level: 'info',
    db: process.env.MONGODB_URI,
    collection: 'logs',
    format: mongoFormat,
    metaKey: 'metadata', // 指定元数据字段
    // 自定义转换
    storeHost: true, // 存储主机信息
    decolorize: true, // 确保移除颜色代码
    transformer: (log) => {
      const transformed = {
        timestamp: new Date(log.timestamp),
        level: log.level,
        message: log.message,
        metadata: {
          ...log.metadata,
          environment: process.env.NODE_ENV || 'development',
        }
      };
      
      // 如果有额外数据,添加到metadata
      if (log.additional) {
        transformed.metadata = {
          ...transformed.metadata,
          ...log.additional
        };
      }
      
      return transformed;
    }
  }),
];

// 创建 logger 实例
const logger = winston.createLogger({
  level: level(),
  levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports,
});

module.exports = logger; 