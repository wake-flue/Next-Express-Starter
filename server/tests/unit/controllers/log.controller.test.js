/**
 * Log 控制器单元测试
 * 测试所有 Log 相关的 API 接口处理逻辑
 */
const logController = require('../../../src/controllers/logController');
const logService = require('../../../src/services/logService');
const mongoose = require('mongoose');

// 模拟 logService
jest.mock('../../../src/services/logService');

describe('LogController', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  // 在每个测试前重置 mock 对象
  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {},
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  // 测试获取日志列表接口
  describe('list', () => {
    beforeEach(() => {
      mockReq = {
        query: {},
      };
    });

    it('should get logs list successfully', async () => {
      const mockLogs = {
        data: [{ level: 'info', message: 'Test log' }],
        pagination: { total: 1, page: 1, pageSize: 20, totalPages: 1 },
        filters: {}
      };
      logService.findWithPagination.mockResolvedValue(mockLogs);

      await logController.list(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockLogs,
        message: '操作成功',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle query parameters correctly', async () => {
      mockReq.query = {
        level: 'error',
        source: 'backend',
        page: '2',
        pageSize: '10'
      };

      await logController.list(mockReq, mockRes, mockNext);

      expect(logService.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({ level: 'error', source: 'backend' }),
        expect.objectContaining({ page: 2, pageSize: 10 })
      );
    });

    it('should handle status filter correctly', async () => {
      mockReq.query = {
        status: '500'
      };

      await logController.list(mockReq, mockRes, mockNext);

      expect(logService.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({ status: 500 }),
        expect.any(Object)
      );
    });

    it('should handle error when getting logs fails', async () => {
      const error = new Error('Database error');
      logService.findWithPagination.mockRejectedValue(error);

      await logController.list(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  // 测试创建日志接口
  describe('create', () => {
    beforeEach(() => {
      mockReq = {
        body: [{
          level: 'info',
          message: 'Test log',
          meta: {
            source: 'backend',
            environment: 'development'
          }
        }],
      };
    });

    it('should create logs successfully', async () => {
      const mockCreatedLogs = [
        {
          _id: new mongoose.Types.ObjectId(),
          ...mockReq.body[0],
          timestamp: new Date()
        }
      ];
      logService.create.mockResolvedValue(mockCreatedLogs);

      await logController.create(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCreatedLogs,
        message: '创建成功',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle invalid request body', async () => {
      mockReq.body = 'invalid body';

      await logController.create(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '日志格式错误, 应为数组',
        data: null,
      });
      expect(logService.create).not.toHaveBeenCalled();
    });

    it('should handle error when creating logs fails', async () => {
      const error = new Error('Validation error');
      logService.create.mockRejectedValue(error);

      await logController.create(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });
}); 