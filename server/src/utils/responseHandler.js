const { HTTP_STATUS } = require("../constants/httpStatus");

class ResponseHandler {
    static formatResponse(success, data = null, message = "") {
        return {
            success,
            data,
            message: message || (success ? "操作成功" : "操作失败"),
        };
    }

    static success(res, data) {
        const formattedResponse = this.formatResponse(true, data);
        return res.status(HTTP_STATUS.OK).json(formattedResponse);
    }

    static error(res, message, error, status = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        res.locals.error = error;
        
        const formattedResponse = this.formatResponse(false, null, message);
        return res.status(status).json(formattedResponse);
    }

    static notFound(res, message = "资源未找到", error) {
        return this.error(res, message, error, HTTP_STATUS.NOT_FOUND);
    }

    static badRequest(res, message = "请求参数错误", error) {
        return this.error(res, message, error, HTTP_STATUS.BAD_REQUEST);
    }

    static created(res, data) {
        const formattedResponse = this.formatResponse(true, data, "创建成功");
        return res.status(HTTP_STATUS.CREATED).json(formattedResponse);
    }

    static unauthorized(res, message = '未授权访问', data = null) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message,
            data
        });
    }
}

module.exports = ResponseHandler;
