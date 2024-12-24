const logService = require("../services/logService");
const ResponseHandler = require("../utils/responseHandler");
const BaseController = require("./BaseController");

class LogController extends BaseController {
    constructor() {
        super();
        this.createLogs = this.createLogs.bind(this);
        this.getLogs = this.getLogs.bind(this);
    }

    async createLogs(req, res) {
        try {
            const { logs } = req.body;

            if (!Array.isArray(logs)) {
                return ResponseHandler.badRequest(res, "无效的日志格式");
            }

            return ResponseHandler.success(res, { message: "日志接收成功" });
        } catch (error) {
            return ResponseHandler.error(res, "服务器内部错误");
        }
    }

    async getLogs(req, res) {
        try {
            const { status, ...query } = req.query;

            if (status) {
                query.status = parseInt(status);
            }

            const paginationParams = this.getPaginationParams(query);
            const result = await logService.getLogs(query, paginationParams);

            return ResponseHandler.success(res, result);
        } catch (error) {
            return ResponseHandler.error(res, "服务器内部错误");
        }
    }
}

module.exports = new LogController();
