const Log = require('../models/Log');

class LogService {
  async addLogs(logs, requestInfo) {
    const logPromises = logs.map(logData => {
      const { level, message, error, client, ...rest } = logData;
      
      return Log.addLog({
        level,
        message,
        source: 'frontend',
        error,
        client,
        metadata: rest,
        request: requestInfo
      });
    });

    return await Promise.all(logPromises);
  }

  async queryLogs(queryParams, paginationParams) {
    return await Log.queryLogs(queryParams, paginationParams);
  }
}

module.exports = new LogService(); 