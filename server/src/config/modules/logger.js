const winston = require('winston');
require('winston-mongodb');

const loggerConfig = {
    level: process.env.LOG_LEVEL || 'info',
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue',
    }
};

// 配置 winston
winston.addColors(loggerConfig.colors);

// 自定义日志格式
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
    // 格式化时间戳
    const formattedTimestamp = new Date(timestamp).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    // 返回格式化的日志字符串
    return `[${formattedTimestamp}] ${level}: ${message}`;
});

// 创建 logger 实例
const logger = winston.createLogger({
    levels: loggerConfig.levels,
    level: loggerConfig.level,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.padLevels(),
        customFormat,
        winston.format.colorize({ all: true })
    ),
    transports: [
        new winston.transports.Console()
    ]
});

module.exports = logger; 