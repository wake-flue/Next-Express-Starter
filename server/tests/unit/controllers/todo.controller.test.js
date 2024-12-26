/**
 * Todo 控制器单元测试
 * 测试所有 Todo 相关的 API 接口处理逻辑
 */
const todoController = require('../../../src/controllers/todoController');
const todoService = require('../../../src/services/todoService');
const mongoose = require('mongoose');

// 模拟 todoService
jest.mock('../../../src/services/todoService');

describe('TodoController', () => {
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

  // 测试获取 Todo 列表接口
  describe('getTodos', () => {
    beforeEach(() => {
      mockReq = {
        query: {},
      };
    });

    // 测试成功获取 Todo 列表的情况
    it('should get todos successfully', async () => {
      // 模拟 service 层返回的数据
      const mockTodos = {
        data: [{ title: 'Test Todo', completed: false }],
        pagination: { total: 1, page: 1, pageSize: 20, totalPages: 1 },
      };
      todoService.getTodos.mockResolvedValue(mockTodos);

      await todoController.getTodos(mockReq, mockRes, mockNext);

      // 验证响应状态和数据
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockTodos,
        message: '操作成功',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    // 测试获取 Todo 列表失败的情况
    it('should handle error when getting todos fails', async () => {
      // 模拟 service 层抛出错误
      const error = new Error('Database error');
      todoService.getTodos.mockRejectedValue(error);

      await todoController.getTodos(mockReq, mockRes, mockNext);

      // 验证错误处理
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  // 测试创建 Todo 接口
  describe('createTodo', () => {
    beforeEach(() => {
      mockReq = {
        body: { title: 'New Todo' },
      };
    });

    // 测试成功创建 Todo 的情况
    it('should create todo successfully', async () => {
      // 模拟创建成功的返回数据
      const mockTodo = { _id: 'mockId', ...mockReq.body };
      todoService.createTodo.mockResolvedValue(mockTodo);

      await todoController.createTodo(mockReq, mockRes, mockNext);

      // 验证创建成功的响应
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockTodo,
        message: '创建成功',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    // 测试创建 Todo 失败的情况
    it('should handle error when creating todo fails', async () => {
      // 模拟创建失败
      const error = new Error('Validation error');
      todoService.createTodo.mockRejectedValue(error);

      await todoController.createTodo(mockReq, mockRes, mockNext);

      // 验证错误处理
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  // 测试更新 Todo 接口
  describe('updateTodo', () => {
    const todoId = new mongoose.Types.ObjectId().toString();

    beforeEach(() => {
      mockReq = {
        params: { id: todoId },
        body: { title: 'Updated Todo' },
      };
    });

    // 测试成功更新 Todo 的情况
    it('should update todo successfully', async () => {
      // 模拟更新成功的返回数据
      const mockTodo = { _id: todoId, ...mockReq.body };
      todoService.updateTodo.mockResolvedValue(mockTodo);

      await todoController.updateTodo(mockReq, mockRes, mockNext);

      // 验证更新成功的响应
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockTodo,
        message: '操作成功',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    // 测试更新不存在的 Todo 的情况
    it('should handle not found error', async () => {
      todoService.updateTodo.mockResolvedValue(null);

      await todoController.updateTodo(mockReq, mockRes, mockNext);

      // 验证未找到的响应
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '待办事项不存在',
        data: null,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    // 测试更新 Todo 失败的情况
    it('should handle error when updating todo fails', async () => {
      // 模拟更新失败
      const error = new Error('Database error');
      todoService.updateTodo.mockRejectedValue(error);

      await todoController.updateTodo(mockReq, mockRes, mockNext);

      // 验证错误处理
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  // 测试删除 Todo 接口
  describe('deleteTodo', () => {
    const todoId = new mongoose.Types.ObjectId().toString();

    beforeEach(() => {
      mockReq = {
        params: { id: todoId },
      };
    });

    // 测试成功删除 Todo 的情况
    it('should delete todo successfully', async () => {
      // 模拟删除成功的返回数据
      const mockTodo = { _id: todoId };
      todoService.deleteTodo.mockResolvedValue(mockTodo);

      await todoController.deleteTodo(mockReq, mockRes, mockNext);

      // 验证删除成功的响应
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: null,
        message: '操作成功',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    // 测试删除不存在的 Todo 的情况
    it('should handle not found error', async () => {
      todoService.deleteTodo.mockResolvedValue(null);

      await todoController.deleteTodo(mockReq, mockRes, mockNext);

      // 验证未找到的响应
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '待办事项不存在',
        data: null,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    // 测试删除 Todo 失败的情况
    it('should handle error when deleting todo fails', async () => {
      // 模拟删除失败
      const error = new Error('Database error');
      todoService.deleteTodo.mockRejectedValue(error);

      await todoController.deleteTodo(mockReq, mockRes, mockNext);

      // 验证错误处理
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });
}); 