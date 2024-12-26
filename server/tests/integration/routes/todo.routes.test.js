/**
 * Todo 路由集成测试
 * 测试所有 Todo 相关的路由端点的实际功能
 * 包括与数据库的交互和错误处理
 */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../src/app');
const Todo = require('../../../src/models/TodoModel');
const config = require('../../../src/config');

const { apiVersion } = config.app;
const API_PREFIX = `/api/${apiVersion}`;

let server;

describe('Todo Routes Integration Tests', () => {
  let testTodo;

  beforeAll((done) => {
    server = app.listen(0, () => done());
  });

  afterAll((done) => {
    server.close(done);
  });

  // 每个测试前创建测试数据
  beforeEach(async () => {
    testTodo = await Todo.create({
      title: 'Test Todo',
      completed: false
    });
  });

  // 测试获取待办事项列表
  describe('GET /todos', () => {
    // 测试成功获取列表
    it('should get todos list successfully', async () => {
      const response = await request(app)
        .get(`${API_PREFIX}/todos`)
        .expect('Content-Type', /json/)
        .expect(200);

      // 验证响应格式和数据
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('操作成功');
      expect(Array.isArray(response.body.data.data)).toBe(true);
      expect(response.body.data.data).toHaveLength(1);
      expect(response.body.data.data[0].title).toBe('Test Todo');
    });

    // 测试分页功能
    it('should handle pagination correctly', async () => {
      // 创建额外的测试数据
      await Todo.create([
        { title: 'Todo 2', completed: false },
        { title: 'Todo 3', completed: true }
      ]);

      const response = await request(app)
        .get(`${API_PREFIX}/todos`)
        .query({ page: 1, pageSize: 2 })
        .expect(200);

      // 验证分页结果
      expect(response.body.data.data).toHaveLength(2);
      expect(response.body.data.pagination.total).toBe(3);
      expect(response.body.data.pagination.totalPages).toBe(2);
    });

    // 测试筛选功能
    it('should filter todos by completed status', async () => {
      await Todo.create({ title: 'Completed Todo', completed: true });

      const response = await request(app)
        .get(`${API_PREFIX}/todos`)
        .query({ completed: 'true' })
        .expect(200);

      // 验证筛选结果
      expect(response.body.data.data).toHaveLength(1);
      expect(response.body.data.data[0].completed).toBe(true);
    });

    // 测试排序功能
    it('should sort todos by specified field', async () => {
      await Todo.create([
        { title: 'A Todo', completed: false },
        { title: 'B Todo', completed: true }
      ]);

      const response = await request(app)
        .get(`${API_PREFIX}/todos`)
        .query({ sortBy: 'title', sortOrder: 'asc' })
        .expect(200);

      // 验证排序结果
      expect(response.body.data.data[0].title).toBe('A Todo');
      expect(response.body.data.data[2].title).toBe('Test Todo');
    });
  });

  // 测试创建待办事项
  describe('POST /todos', () => {
    // 测试成功创建
    it('should create todo successfully', async () => {
      const newTodo = {
        title: 'New Todo',
        completed: false
      };

      const response = await request(app)
        .post(`${API_PREFIX}/todos`)
        .send(newTodo)
        .expect('Content-Type', /json/)
        .expect(201);

      // 验证创建结果
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('创建成功');
      expect(response.body.data.title).toBe(newTodo.title);
      expect(response.body.data.completed).toBe(newTodo.completed);

      // 验证数据库中是否正确保存
      const savedTodo = await Todo.findById(response.body.data._id);
      expect(savedTodo).toBeTruthy();
      expect(savedTodo.title).toBe(newTodo.title);
    });

    // 测试标题验证
    it('should validate required title field', async () => {
      const response = await request(app)
        .post(`${API_PREFIX}/todos`)
        .send({ completed: false })
        .expect(400);

      // 验证错误响应
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('标题');
    });

    // 测试标题长度验证
    it('should validate title length', async () => {
      const response = await request(app)
        .post(`${API_PREFIX}/todos`)
        .send({ title: 'a'.repeat(101), completed: false })
        .expect(400);

      // 验证错误响应
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('长度');
    });
  });

  // 测试更新待办事项
  describe('PUT /todos/:id', () => {
    // 测试成功更新
    it('should update todo successfully', async () => {
      const updateData = {
        title: 'Updated Todo',
        completed: true
      };

      const response = await request(app)
        .put(`${API_PREFIX}/todos/${testTodo._id}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      // 验证更新结果
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('操作成功');
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.completed).toBe(updateData.completed);

      // 验证数据库中是否正确更新
      const updatedTodo = await Todo.findById(testTodo._id);
      expect(updatedTodo.title).toBe(updateData.title);
      expect(updatedTodo.completed).toBe(updateData.completed);
    });

    // 测试部分字段更新
    it('should partially update todo', async () => {
      const response = await request(app)
        .put(`${API_PREFIX}/todos/${testTodo._id}`)
        .send({ completed: true })
        .expect(200);

      // 验证部分更新结果
      expect(response.body.data.title).toBe(testTodo.title);
      expect(response.body.data.completed).toBe(true);
    });

    // 测试更新不存在的待办事项
    it('should handle non-existent todo', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .put(`${API_PREFIX}/todos/${nonExistentId}`)
        .send({ title: 'Updated Title' })
        .expect(404);

      // 验证错误响应
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('待办事项不存在');
    });

    // 测试无效的ID格式
    it('should handle invalid todo id', async () => {
      const response = await request(app)
        .put(`${API_PREFIX}/todos/invalid-id`)
        .send({ title: 'Updated Title' })
        .expect(400);

      // 验证错误响应
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('ID');
    });
  });

  // 测试删除待办事项
  describe('DELETE /todos/:id', () => {
    // 测试成功删除
    it('should delete todo successfully', async () => {
      const response = await request(app)
        .delete(`${API_PREFIX}/todos/${testTodo._id}`)
        .expect('Content-Type', /json/)
        .expect(200);

      // 验证删除结果
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('操作成功');
      
      // 验证数据库中是否已删除
      const deletedTodo = await Todo.findById(testTodo._id);
      expect(deletedTodo).toBeNull();
    });

    // 测试删除不存在的待办事项
    it('should handle non-existent todo', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`${API_PREFIX}/todos/${nonExistentId}`)
        .expect(404);

      // 验证错误响应
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('待办事项不存在');
    });

    // 测试无效的ID格式
    it('should handle invalid todo id', async () => {
      const response = await request(app)
        .delete(`${API_PREFIX}/todos/invalid-id`)
        .expect(400);

      // 验证错误响应
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('ID');
    });
  });
}); 