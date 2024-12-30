const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/apiError');

/**
 * 验证中间件
 * 用于处理express-validator的验证结果
 */
const validate = validations => {
  return async (req, res, next) => {
    // 执行所有验证
    await Promise.all(validations.map(validation => validation.run(req)));

    // 获取验证结果
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // 格式化错误信息
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
      value: err.value
    }));

    // 抛出ApiError由errorHandler处理
    const error = new ApiError(400, formattedErrors[0].message);
    error.name = 'ValidationError';
    error.errors = formattedErrors;

    next(error);
  };
};

module.exports = {
  validate
}; 