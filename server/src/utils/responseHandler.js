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
        return res.status(200).json(formattedResponse);
    }

    static error(res, message, status = 500) {
        const formattedResponse = this.formatResponse(false, null, message);
        return res.status(status).json(formattedResponse);
    }

    static notFound(res, message = "资源未找到") {
        return this.error(res, message, 404);
    }

    static badRequest(res, message = "请求参数错误") {
        return this.error(res, message, 400);
    }

    static created(res, data) {
        const formattedResponse = this.formatResponse(true, data, "创建成功");
        return res.status(201).json(formattedResponse);
    }
}

module.exports = ResponseHandler;
