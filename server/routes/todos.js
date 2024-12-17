const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const logger = require('../config/logger');

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required: [title]
 *       properties:
 *         _id: 
 *           type: string
 *         title:
 *           type: string
 *         completed:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/todos:
 *   get:
 *     tags: [Todos]
 *     summary: 获取所有待办事项
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    logger.info('获取所有待办事项成功', {
      count: todos.length,
      source: 'server',
      operation: 'GET_TODOS'
    });
    res.json(todos);
  } catch (error) {
    logger.error('获取待办事项失败', {
      error: error.message,
      source: 'server',
      operation: 'GET_TODOS'
    });
    res.status(500).json({ error: '获取待办事项失败' });
  }
});

/**
 * @swagger
 * /api/v1/todos:
 *   post:
 *     tags: [Todos]
 *     summary: 创建待办事项
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 */
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    const todo = new Todo({ title });
    const savedTodo = await todo.save();
    logger.info('创建待办事项成功', {
      todoId: savedTodo._id,
      title: savedTodo.title,
      source: 'server',
      operation: 'CREATE_TODO'
    });
    res.status(201).json(savedTodo);
  } catch (error) {
    logger.error('创建待办事项失败', {
      error: error.message,
      title: req.body.title,
      source: 'server',
      operation: 'CREATE_TODO'
    });
    res.status(500).json({ error: '创建待办事项失败' });
  }
});

/**
 * @swagger
 * /api/v1/todos/{id}:
 *   put:
 *     tags: [Todos]
 *     summary: 更新待办事项
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true }
    );
    if (!updatedTodo) {
      logger.warn('更新待办事项失败: 项目不存在', {
        todoId: id,
        source: 'server',
        operation: 'UPDATE_TODO'
      });
      return res.status(404).json({ error: '待办事项不存在' });
    }
    logger.info('更新待办事项成功', {
      todoId: id,
      title: updatedTodo.title,
      completed: updatedTodo.completed,
      source: 'server',
      operation: 'UPDATE_TODO'
    });
    res.json(updatedTodo);
  } catch (error) {
    logger.error('更新待办事项失败', {
      error: error.message,
      todoId: req.params.id,
      source: 'server',
      operation: 'UPDATE_TODO'
    });
    res.status(500).json({ error: '更新待办事项失败' });
  }
});

/**
 * @swagger
 * /api/v1/todos/{id}:
 *   delete:
 *     tags: [Todos]
 *     summary: 删除待办事项
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      logger.warn('删除待办事项失败: 项目不存在', {
        todoId: id,
        source: 'server',
        operation: 'DELETE_TODO'
      });
      return res.status(404).json({ error: '待办事项不存在' });
    }
    logger.info('删除待办事项成功', {
      todoId: id,
      title: deletedTodo.title,
      source: 'server',
      operation: 'DELETE_TODO'
    });
    res.json({ message: '待办事项已删除' });
  } catch (error) {
    logger.error('删除待办事项失败', {
      error: error.message,
      todoId: req.params.id,
      source: 'server',
      operation: 'DELETE_TODO'
    });
    res.status(500).json({ error: '删除待办事项失败' });
  }
});

module.exports = router; 