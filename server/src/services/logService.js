const Log = require("../models/LogModel");

class LogService {
    async getLogs(filters = {}, pagination = {}) {
        const { page = 1, pageSize = 20, sortBy = "timestamp", sortOrder = "desc" } = pagination;

        // 构建查询条件
        const query = {};
        const cleanFilters = { ...filters };

        // 从filters中移除分页参数
        delete cleanFilters.page;
        delete cleanFilters.pageSize;
        delete cleanFilters.sortBy;
        delete cleanFilters.sortOrder;

        // 构建过滤条件
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

        // 验证并构建排序对象
        const validSortFields = ["timestamp", "level", "message", "createdAt"];
        const validSortOrders = ["asc", "desc"];

        const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "timestamp";
        const finalSortOrder = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : "desc";

        const sort = {
            [finalSortBy]: finalSortOrder === "desc" ? -1 : 1,
        };

        // 计算总数
        const total = await Log.countDocuments(query);

        // 获取分页数据
        const data = await Log.find(query)
            .sort(sort)
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return {
            data,
            pagination: {
                total,
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                totalPages: Math.ceil(total / pageSize),
            },
            filters: cleanFilters,
            sort: {
                sortBy: finalSortBy,
                sortOrder: finalSortOrder,
            },
        };
    }

    async createLogs(logs) {
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
