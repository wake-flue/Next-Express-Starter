const config = require('../config');
const logger = config.logger;

class LogHandler {
  static formatMetadata(metadata = {}) {
    // 移除空值、未定义的字段和重复字段
    const cleanMetadata = Object.entries(metadata).reduce((acc, [key, value]) => {
      if (value !== null && 
          value !== undefined && 
          key !== 'responseData' &&
          key !== 'timestamp' &&
          key !== 'level' &&
          key !== 'message' &&
          key !== 'meta' &&
          key !== 'type') {
        acc[key] = value;
      }
      return acc;
    }, {});

    // 移除空值的字段
    const finalMetadata = Object.entries({
      source: 'backend',
      environment: process.env.NODE_ENV,
      ...cleanMetadata
    }).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    return finalMetadata;
  }

  static formatError(error) {
    if (!error) return null;
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error.code && { code: error.code }),
      ...(error.status && { status: error.status })
    };
  }

  static logResponse(status, data, metadata = {}) {
    const duration = metadata.duration || 0;
    const message = `Response sent with status ${status} in ${duration}ms`;
    
    const logData = {
      status,
      duration,
      operation: metadata.operation,
      ...this.formatMetadata(metadata)
    };

    if (status >= 500) {
      logger.error(message, logData);
    } else if (status >= 400) {
      logger.warn(message, logData);
    } else {
      logger.info(message, logData);
    }
  }

  static logRequest(requestInfo, metadata = {}) {
    const message = `${requestInfo.method} ${requestInfo.url} ${requestInfo.status} ${requestInfo.duration}ms`;
    
    const logData = {
      requestInfo: {
        method: requestInfo.method,
        url: requestInfo.url,
        status: requestInfo.status,
        duration: requestInfo.duration,
        ip: requestInfo.ip,
        userAgent: requestInfo.userAgent,
        host: requestInfo.host
      },
      operation: metadata.operation,
      ...this.formatMetadata(metadata)
    };

    if (requestInfo.status >= 500) {
      logger.error(message, logData);
    } else if (requestInfo.status >= 400) {
      logger.warn(message, logData);
    } else {
      logger.http(message, logData);
    }
  }

  static error(message, metadata = {}) {
    const logData = {
      error: this.formatError(metadata.error),
      operation: metadata.operation,
      ...this.formatMetadata(metadata)
    };
    logger.error(message, logData);
  }

  static warn(message, metadata = {}) {
    const logData = {
      operation: metadata.operation,
      ...this.formatMetadata(metadata)
    };
    logger.warn(message, logData);
  }

  static info(message, metadata = {}) {
    const logData = {
      operation: metadata.operation,
      ...this.formatMetadata(metadata)
    };
    logger.info(message, logData);
  }

  static http(message, metadata = {}) {
    const logData = {
      operation: metadata.operation,
      ...this.formatMetadata(metadata)
    };
    logger.http(message, logData);
  }

  static debug(message, metadata = {}) {
    const logData = {
      operation: metadata.operation,
      ...this.formatMetadata(metadata)
    };
    logger.debug(message, logData);
  }
}

module.exports = LogHandler; 