const ResponseHandler = require('../utils/responseHandler');

class BaseController {
  // 处理分页参数
  getPaginationParams(query) {
    const { 
      page = 1, 
      pageSize = 20, 
      sort = { createdAt: -1 }
    } = query;

    return {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      sort: typeof sort === 'string' ? JSON.parse(sort) : sort
    };
  }

  // 格式化分页元数据
  formatPaginationMetadata(paginationParams, total) {
    return {
      page: paginationParams.page,
      pageSize: paginationParams.pageSize,
      total,
      totalPages: Math.ceil(total / paginationParams.pageSize)
    };
  }

  // 格式化基础元数据
  formatBaseMetadata(req, operation) {
    return {
      operation,
      requestId: req.id,
      userId: req.user?.id,
      clientInfo: {
        userAgent: req.get('user-agent'),
        ip: req.ip,
        host: req.get('host')
      }
    };
  }
}

module.exports = BaseController; 