const LogHandler = require("../utils/logHandler");
const { HTTP_STATUS } = require("../constants/httpStatus");

// 500错误处理中间件
const errorHandler = (err, req, res, next) => {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: process.env.NODE_ENV === "development" ? err.message : "服务器内部错误",
    });
};

// 404错误处理中间件
const notFoundHandler = (req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "请求的资源不存在",
    });
};

module.exports = {
    errorHandler,
    notFoundHandler,
};
