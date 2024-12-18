const winston = require('winston');
require('winston-mongodb');
const path = require('path');
const { COLLECTIONS } = require('./db');

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
  winston.format.json(),
  winston.format((info) => {
    // 转换为与 Log 模型兼容的格式
    const transformed = {
      timestamp: new Date(info.timestamp),
      level: info.level,
      message: info.message,
      source: 'backend',
      environment: process.env.NODE_ENV || 'development',
      metadata: {}
    };

    // 处理错误信息
    if (info.error instanceof Error) {
      transformed.error = {
        name: info.error.name,
        message: info.error.message,
        stack: info.error.stack
      };
    }

    // 处理请求信息
    if (info.request) {
      transformed.request = {
        method: info.request.method,
        url: info.request.url,
        status: info.request.status,
        duration: info.request.duration,
        userAgent: info.request.userAgent,
        ip: info.request.ip,
        host: info.request.host
      };
    }

    // 处理其他元数据
    if (info.metadata) {
      transformed.metadata = {
        ...transformed.metadata,
        ...info.metadata
      };
    }

    return transformed;
  })()
);

// MongoDB 传输配置
const mongoTransportOptions = {
  level: 'info',
  db: process.env.MONGODB_URI,
  collection: COLLECTIONS.LOGS,
  format: mongoFormat,
  // 使用新的 MongoDB 驱动选项
  options: {
    maxPoolSize: 2,
    minPoolSize: 1,
    writeConcern: {
      w: 1,
      j: true
    }
  }
};

// 定义日志传输目标
const transports = [
  // 控制台输出
  new winston.transports.Console({
    format: consoleFormat
  }),
  
  // MongoDB 存储
  new winston.transports.MongoDB(mongoTransportOptions)
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
  // 错误处理
  exceptionHandlers: [
    new winston.transports.MongoDB({
      ...mongoTransportOptions,
      level: 'error',
      collection: `${COLLECTIONS.LOGS}_exceptions`
    })
  ],
  // 退出时处理
  exitOnError: false
});

module.exports = logger; 