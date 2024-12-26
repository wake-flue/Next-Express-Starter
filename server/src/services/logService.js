const Log = require("../models/LogModel");
const BaseService = require("./BaseService");
const PaginationUtils = require("../utils/paginationUtils");

class LogService extends BaseService {
    constructor() {
        super(Log);
        this.validSortFields = ["timestamp", "level", "message", "createdAt"];
    }

    // 构建日志查询条件
    _buildLogQuery(filters = {}) {
        const query = {};
        const cleanFilters = PaginationUtils.cleanQueryParams(filters);

        if (cleanFilters.level) {
            query.level = cleanFilters.level;
        }
        if (cleanFilters.source) {
            query["meta.source"] = cleanFilters.source;
        }
        if (cleanFilters.status) {
            query["meta.responseInfo.status"] = cleanFilters.status;
        }
        if (cleanFilters.resourceType) {
            query["meta.resourceType"] = cleanFilters.resourceType;
        }
        if (cleanFilters.operation) {
            query["meta.operation"] = cleanFilters.operation;
        }
        if (cleanFilters.errorType) {
            query["error.name"] = cleanFilters.errorType;
        }
        if (cleanFilters.startTime || cleanFilters.endTime) {
            query.timestamp = {};
            if (cleanFilters.startTime) {
                query.timestamp.$gte = new Date(cleanFilters.startTime);
            }
            if (cleanFilters.endTime) {
                query.timestamp.$lte = new Date(cleanFilters.endTime);
            }
        }
        if (cleanFilters.search) {
            query.$or = [
                { message: { $regex: cleanFilters.search, $options: "i" } },
                { "meta.operation": { $regex: cleanFilters.search, $options: "i" } },
            ];
        }
        if (cleanFilters.environment) {
            query["meta.environment"] = cleanFilters.environment;
        }

        return query;
    }

    async findWithPagination(filters = {}, pagination = {}) {
        const query = this._buildLogQuery(filters);
        const result = await super.findWithPagination(query, pagination, this.validSortFields);
        return {
            ...result,
            filters: PaginationUtils.cleanQueryParams(filters)
        };
    }

    async create(logs) {
        // 确保每个日志都有timestamp
        const logsWithTimestamp = logs.map(log => ({
            ...log,
            timestamp: log.timestamp || new Date(),
        }));

        // 批量创建日志
        return await Log.insertMany(logsWithTimestamp);
    }
}

module.exports = new LogService();
