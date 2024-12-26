const logService = require("../services/logService");
const ResponseHandler = require("../utils/responseHandler");
const BaseController = require("./BaseController");
const PaginationUtils = require("../utils/paginationUtils");

class LogController extends BaseController {
    constructor() {
        super(logService);
        this.createLogs = this.createLogs.bind(this);
        this.getLogs = this.getLogs.bind(this);
    }

    async createLogs(req, res, next) {
        try {
            const logs = req.body;

            if (!Array.isArray(logs)) {
                return ResponseHandler.badRequest(res, "日志格式错误", new Error("日志格式错误"));
            }

            const result = await this.service.createLogs(logs);
            return ResponseHandler.created(res, result);
        } catch (error) {
            next(error);
        }
    }

    async getLogs(req, res, next) {
        try {
            const { status, ...query } = req.query;
            const paginationParams = PaginationUtils.processPaginationParams(query);
            const filters = PaginationUtils.cleanQueryParams(query);

            if (status) {
                filters.status = parseInt(status);
            }

            const result = await this.service.getLogs(filters, paginationParams);
            return ResponseHandler.success(res, result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new LogController();
