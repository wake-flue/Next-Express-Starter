const mongoose = require('mongoose');
const { COLLECTIONS } = require('../config/db');

const logSchema = new mongoose.Schema({
  // 基础日志信息
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  level: {
    type: String,
    required: true,
    enum: ['error', 'warn', 'info', 'http', 'debug'],
    index: true
  },
  message: {
    type: String,
    required: true
  },
  
  // 元数据
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // 日志来源
  source: {
    type: String,
    enum: ['frontend', 'backend'],
    required: true,
    index: true
  },
  
  // 环境信息
  environment: {
    type: String,
    required: true,
    default: process.env.NODE_ENV || 'development',
    index: true
  },
  
  // HTTP 请求信息 (用于请求日志)
  request: {
    method: String,
    url: String,
    status: Number,
    duration: Number,
    userAgent: String,
    ip: String,
    host: String
  },
  
  // 错误信息 (用于错误日志)
  error: {
    name: String,
    message: String,
    stack: String
  },
  
  // 前端特有信息
  client: {
    browser: String,
    os: String,
    device: String,
    url: String
  }
}, {
  timestamps: true,
  minimize: false,
  strict: false
});

// 创建复合索引
logSchema.index({ timestamp: -1, level: 1, source: 1 });
logSchema.index({ timestamp: -1, environment: 1 });
logSchema.index({ 'request.status': 1, timestamp: -1 });
logSchema.index({ 'error.name': 1, timestamp: -1 });

// 查询方法
logSchema.statics.queryLogs = async function(filters = {}, options = {}) {
  const {
    page = 1,
    pageSize = 20,
    sort = { timestamp: -1 }
  } = options;

  const query = {};
  
  // 基础过滤条件
  if (filters.level) {
    query.level = filters.level;
  }
  if (filters.source) {
    query.source = filters.source;
  }
  if (filters.environment) {
    query.environment = filters.environment;
  }
  
  // 时间范围
  if (filters.startTime || filters.endTime) {
    query.timestamp = {};
    if (filters.startTime) {
      query.timestamp.$gte = new Date(filters.startTime);
    }
    if (filters.endTime) {
      query.timestamp.$lte = new Date(filters.endTime);
    }
  }
  
  // HTTP状态码
  if (filters.status) {
    query['request.status'] = filters.status;
  }
  
  // 错误类型
  if (filters.errorType) {
    query['error.name'] = filters.errorType;
  }
  
  // 搜索
  if (filters.search) {
    query.$or = [
      { message: new RegExp(filters.search, 'i') },
      { 'error.message': new RegExp(filters.search, 'i') }
    ];
  }

  // 执行查询
  const total = await this.countDocuments(query);
  const logs = await this.find(query)
    .sort(sort)
    .skip((page - 1) * pageSize)
    .limit(parseInt(pageSize))
    .lean();

  return {
    total,
    logs,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
};

// 添加日志方法
logSchema.statics.addLog = function(logData) {
  const log = new this({
    ...logData,
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
  return log.save();
};

const Log = mongoose.model(COLLECTIONS.LOGS, logSchema);

module.exports = Log;
