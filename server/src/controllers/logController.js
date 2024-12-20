const config = require('../config');
const logService = require('../services/logService');
const ResponseHandler = require('../utils/responseHandler');

const logger = config.logger;

// 定义日志操作类型
const LOG_OPERATIONS = {
    GET_LOGS: 'GET_LOGS',
    POST_LOGS: 'POST_LOGS'
};

class LogController {
    async addLogs(req, res) {
        try {
            const { logs } = req.body;

            if (!Array.isArray(logs)) {
                return ResponseHandler.badRequest(res, '无效的日志格式');
            }

            const requestInfo = {
                userAgent: req.get('user-agent'),
                ip: req.ip,
                host: req.get('host')
            };

            logger.info('日志接收成功', {
                metadata: {
                    operation: LOG_OPERATIONS.POST_LOGS,
                    requestInfo: requestInfo
                }
            });
            return ResponseHandler.success(res, { message: '日志接收成功' });
        } catch (error) {
            logger.error('处理前端日志时出错:', { error });
            return ResponseHandler.error(res, '服务器内部错误');
        }
    }

    async queryLogs(req, res) {
        try {
            const {
                level,
                source,
                startTime,
                endTime,
                status,
                errorType,
                search,
                page,
                pageSize,
                sort
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

            const paginationParams = {
                page: page ? parseInt(page) : 1,
                pageSize: pageSize ? parseInt(pageSize) : 20,
                sort: sort ? JSON.parse(sort) : { timestamp: -1 }
            };

            const result = await logService.queryLogs(queryParams, paginationParams);

            logger.info('查询日志成功', {
                metadata: {
                    operation: LOG_OPERATIONS.GET_LOGS,
                    query: req.query,
                    count: result.logs.length
                }
            });

            return ResponseHandler.success(res, result);
        } catch (error) {
            logger.error('查询日志时出错:', { error });
            return ResponseHandler.error(res, '服务器内部错误');
        }
    }
}

module.exports = new LogController(); 