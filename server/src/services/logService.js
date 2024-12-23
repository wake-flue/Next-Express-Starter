const Log = require('../models/log');

class LogService {
  async getLogs(filters = {}, pagination = {}) {
    const {
      page = 1,
      pageSize = 20,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = pagination;

    // 构建查询条件
    const query = {};
    const cleanFilters = { ...filters };
    
    // 从filters中移除非过滤参数
    delete cleanFilters.page;
    delete cleanFilters.pageSize;
    delete cleanFilters.sortBy;
    delete cleanFilters.sortOrder;

    // 构建过滤条件
    if (cleanFilters.level) {
      query.level = cleanFilters.level;
    }
    if (cleanFilters.source) {
      query.source = cleanFilters.source;
    }
    if (cleanFilters.status) {
      query['metadata.status'] = cleanFilters.status;
    }
    if (cleanFilters.errorType) {
      query['metadata.error.name'] = cleanFilters.errorType;
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
        { message: { $regex: cleanFilters.search, $options: 'i' } },
        { 'metadata.operation': { $regex: cleanFilters.search, $options: 'i' } }
      ];
    }

    // 构建排序对象
    const sort = {
      [sortBy]: sortOrder === 'desc' ? -1 : 1
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
        totalPages: Math.ceil(total / pageSize)
      },
      filters: cleanFilters
    };
  }
}

module.exports = new LogService(); 