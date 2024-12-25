const { HTTP_STATUS } = require("../constants/httpStatus");

class ResponseHandler {
    static formatResponse(success, data = null, message = "") {
        const response = {
            success,
            message: message || (success ? "操作成功" : "操作失败"),
        };

        // 处理分页数据
        if (data && data.pagination) {
            response.data = data.data;
            response.pagination = data.pagination;
            if (data.filters) response.filters = data.filters;
        } else {
            response.data = data;
        }

        return response;
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
}

module.exports = ResponseHandler;
