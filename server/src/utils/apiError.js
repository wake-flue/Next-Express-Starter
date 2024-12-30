/**
 * 自定义 API 错误类
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = '未授权访问') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends ApiError {
  constructor(message = '无权限访问') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

module.exports = {
  ApiError,
  UnauthorizedError,
  ForbiddenError
}; 