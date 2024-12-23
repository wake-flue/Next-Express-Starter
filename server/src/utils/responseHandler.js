const LogHandler = require('./logHandler');

class ResponseHandler {
  static formatMetadata(metadata = {}) {
    return {
      operation: metadata.operation,
      requestId: metadata.requestId,
      userId: metadata.userId,
      duration: metadata.duration,
      ...metadata
    };
  }

  static formatResponse(success, data = null, message = '', metadata = {}) {
    const response = {
      success,
      message: message || (success ? '操作成功' : '操作失败')
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

  static getResponseMetrics(data) {
    const metrics = {
      dataLength: 0
    };

    if (Array.isArray(data)) {
      metrics.dataLength = data.length;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.data)) {
        metrics.dataLength = data.data.length;
      }
    }

    return metrics;
  }

  static success(res, data, metadata = {}) {
    const start = new Date();
    const formattedResponse = this.formatResponse(true, data);
    const result = res.status(200).json(formattedResponse);
    const metrics = this.getResponseMetrics(data);
    
    LogHandler.logResponse(200, formattedResponse, this.formatMetadata({
      ...metadata,
      duration: new Date() - start,
      responseMetrics: metrics
    }));
    
    return result;
  }

  static error(res, message, metadata = {}) {
    const start = new Date();
    const status = metadata.status || 500;
    const formattedResponse = this.formatResponse(false, null, message);
    const result = res.status(status).json(formattedResponse);

    LogHandler.logResponse(status, formattedResponse, this.formatMetadata({
      ...metadata,
      duration: new Date() - start,
      responseMetrics: {
        dataLength: 0
      }
    }));

    return result;
  }

  static notFound(res, message = '资源未找到', metadata = {}) {
    return this.error(res, message, this.formatMetadata({
      ...metadata,
      status: 404
    }));
  }

  static badRequest(res, message = '请求参数错误', metadata = {}) {
    return this.error(res, message, this.formatMetadata({
      ...metadata,
      status: 400
    }));
  }

  static created(res, data, metadata = {}) {
    const start = new Date();
    const formattedResponse = this.formatResponse(true, data, '创建成功');
    const result = res.status(201).json(formattedResponse);
    const metrics = this.getResponseMetrics(data);

    LogHandler.logResponse(201, formattedResponse, this.formatMetadata({
      ...metadata,
      duration: new Date() - start,
      responseMetrics: metrics
    }));

    return result;
  }
}

module.exports = ResponseHandler; 