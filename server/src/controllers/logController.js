const logService = require('../services/logService');
const ResponseHandler = require('../utils/responseHandler');
const BaseController = require('./BaseController');

const LOG_OPERATIONS = {
    GET_LOGS: 'GET_LOGS',
    CREATE_LOGS: 'CREATE_LOGS'
};

class LogController extends BaseController {
    constructor() {
        super();
        // 绑定所有方法到实例
        this.createLogs = this.createLogs.bind(this);
        this.getLogs = this.getLogs.bind(this);
    }

    async createLogs(req, res) {
        try {
            const { logs } = req.body;

            if (!Array.isArray(logs)) {
                return ResponseHandler.badRequest(res, '无效的日志格式', {
                    ...this.formatBaseMetadata(req, LOG_OPERATIONS.CREATE_LOGS),
                    logsCount: 0,
                    error: 'Invalid logs format'
                });
            }

            return ResponseHandler.success(res, { message: '日志接收成功' }, {
                ...this.formatBaseMetadata(req, LOG_OPERATIONS.CREATE_LOGS),
                logsCount: logs.length
            });
        } catch (error) {
            return ResponseHandler.error(res, '服务器内部错误', {
                ...this.formatBaseMetadata(req, LOG_OPERATIONS.CREATE_LOGS),
                error
            });
        }
    }

    async getLogs(req, res) {
        try {
            const {
                level,
                source,
                startTime,
                endTime,
                status,
                errorType,
                search,
                ...query
            } = req.query;

            const queryParams = {
                level,
                source,
                startTime,
                endTime,
                status: status ? parseInt(status) : undefined,
                errorType,
                search
            };

            const paginationParams = this.getPaginationParams(query);
            const result = await logService.getLogs(queryParams, paginationParams);

            return ResponseHandler.success(res, result, {
                ...this.formatBaseMetadata(req, LOG_OPERATIONS.GET_LOGS),
                queryParams,
                pagination: this.formatPaginationMetadata(paginationParams, result.total)
            });
        } catch (error) {
            return ResponseHandler.error(res, '服务器内部错误', {
                ...this.formatBaseMetadata(req, LOG_OPERATIONS.GET_LOGS),
                error,
                queryParams: req.query
            });
        }
    }
}

module.exports = new LogController(); 