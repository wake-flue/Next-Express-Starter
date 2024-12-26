/**
 * Todo 服务层单元测试
 * 测试 Todo 服务层的所有业务逻辑功能
 */
const Todo = require('../../../src/models/TodoModel');
const todoService = require('../../../src/services/todoService');
const mongoose = require('mongoose');

describe('TodoService', () => {
  // 每个测试前清空数据库
  beforeEach(async () => {
    await Todo.deleteMany({});
  });

  // 测试获取 Todo 列表功能
  describe('getTodos', () => {
    // 在测试前准备测试数据
    beforeEach(async () => {
      const now = new Date();
      const todos = [
        { 
          title: 'First Todo', 
          completed: false,
          createdAt: new Date(now.getTime() - 2000)
        },
        { 
          title: 'Second Todo', 
          completed: true,
          createdAt: new Date(now.getTime() - 1000)
        },
        { 
          title: 'Third Todo', 
          completed: false,
          createdAt: now
        },
      ];
      await Todo.insertMany(todos);
    });

    // 测试分页功能
    it('should get todos with pagination', async () => {
      const result = await todoService.getTodos({}, { page: 1, pageSize: 2 });
      
      // 验证分页结果
      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.totalPages).toBe(2);
    });

    // 测试根据完成状态筛选
    it('should filter todos by completed status', async () => {
      const result = await todoService.getTodos({ completed: 'true' });
      
      // 验证筛选结果
      expect(result.data).toHaveLength(1);
      expect(result.data[0].completed).toBe(true);
    });

    // 测试根据标题搜索
    it('should filter todos by title search', async () => {
      const result = await todoService.getTodos({ title: 'First' });
      
      // 验证搜索结果
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('First Todo');
    });

    // 测试默认排序（按创建时间降序）
    it('should sort todos by createdAt desc by default', async () => {
      const result = await todoService.getTodos();
      
      // 验证默认排序结果
      expect(result.data[0].title).toBe('Third Todo');
      expect(result.data[2].title).toBe('First Todo');
    });

    // 测试自定义排序
    it('should sort todos by specified field and order', async () => {
      const result = await todoService.getTodos({}, { sortBy: 'title', sortOrder: 'asc' });
      
      // 验证自定义排序结果
      expect(result.data[0].title).toBe('First Todo');
      expect(result.data[2].title).toBe('Third Todo');
    });
  });

  // 测试创建 Todo 功能
  describe('createTodo', () => {
    // 测试成功创建 Todo
    it('should create todo successfully', async () => {
      const todoData = { title: 'New Todo', completed: true };
      const todo = await todoService.createTodo(todoData);
      
      // 验证创建结果
      expect(todo.title).toBe(todoData.title);
      expect(todo.completed).toBe(todoData.completed);
      expect(todo.createdAt).toBeDefined();
      expect(todo.updatedAt).toBeDefined();
    });

    // 测试创建时的默认值
    it('should create todo with default completed status', async () => {
      const todoData = { title: 'New Todo' };
      const todo = await todoService.createTodo(todoData);
      
      // 验证默认值
      expect(todo.completed).toBe(false);
    });
  });

  // 测试更新 Todo 功能
  describe('updateTodo', () => {
    let existingTodo;

    // 在测试前创建一个待更新的 Todo
    beforeEach(async () => {
      existingTodo = await Todo.create({ title: 'Original Todo' });
    });

    // 测试完整更新 Todo
    it('should update todo successfully', async () => {
      const updateData = { title: 'Updated Todo', completed: true };
      const updatedTodo = await todoService.updateTodo(existingTodo._id, updateData);
      
      // 验证更新结果
      expect(updatedTodo.title).toBe(updateData.title);
      expect(updatedTodo.completed).toBe(updateData.completed);
    });

    // 测试部分字段更新
    it('should partially update todo', async () => {
      const updateData = { completed: true };
      const updatedTodo = await todoService.updateTodo(existingTodo._id, updateData);
      
      // 验证部分更新结果
      expect(updatedTodo.title).toBe(existingTodo.title);
      expect(updatedTodo.completed).toBe(true);
    });

    // 测试更新不存在的 Todo
    it('should return null for non-existent todo', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updatedTodo = await todoService.updateTodo(nonExistentId, { title: 'New Title' });
      
      // 验证返回空结果
      expect(updatedTodo).toBeNull();
    });
  });

  // 测试删除 Todo 功能
  describe('deleteTodo', () => {
    let existingTodo;

    // 在测试前创建一个待删除的 Todo
    beforeEach(async () => {
      existingTodo = await Todo.create({ title: 'Todo to Delete' });
    });

    // 测试成功删除 Todo
    it('should delete todo successfully', async () => {
      const deletedTodo = await todoService.deleteTodo(existingTodo._id);
      const foundTodo = await Todo.findById(existingTodo._id);
      
      // 验证删除结果
      expect(deletedTodo._id).toEqual(existingTodo._id);
      expect(foundTodo).toBeNull();
    });

    // 测试删除不存在的 Todo
    it('should return null for non-existent todo', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const deletedTodo = await todoService.deleteTodo(nonExistentId);
      
      // 验证返回空结果
      expect(deletedTodo).toBeNull();
    });
  });
}); 