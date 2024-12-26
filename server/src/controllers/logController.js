const logService = require("../services/logService");
const ResponseHandler = require("../utils/responseHandler");
const BaseController = require("./BaseController");

class LogController extends BaseController {
    constructor() {
        super();
        this.createLogs = this.createLogs.bind(this);
        this.getLogs = this.getLogs.bind(this);
    }

    async createLogs(req, res, next) {
        try {
            const logs = req.body;

            if (!Array.isArray(logs)) {
                return ResponseHandler.badRequest(res, "日志格式错误", new Error("日志格式错误"));
            }

            const result = await logService.createLogs(logs);
            return ResponseHandler.created(res, result);
        } catch (error) {
            next(error);
        }
    }

    async getLogs(req, res, next) {
        try {
            const { status, ...query } = req.query;

            if (status) {
                query.status = parseInt(status);
            }

            const paginationParams = this.getPaginationParams(query);
            const result = await logService.getLogs(query, paginationParams);

            return ResponseHandler.success(res, result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new LogController();
