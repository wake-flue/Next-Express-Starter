const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const logger = require('../config/logger');

// 定义日志操作类型
const LOG_OPERATIONS = {
  GET_TODOS: 'GET_TODOS',
  CREATE_TODO: 'CREATE_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  DELETE_TODO: 'DELETE_TODO'
};

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
      metadata: {
        operation: LOG_OPERATIONS.GET_TODOS,
        count: todos.length,
        query: req.query
      }
    });
    
    res.json(todos);
  } catch (error) {
    logger.error('获取待办事项失败', {
      error,
      metadata: {
        operation: LOG_OPERATIONS.GET_TODOS,
        query: req.query
      }
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
      metadata: {
        operation: LOG_OPERATIONS.CREATE_TODO,
        todoId: savedTodo._id,
        title: savedTodo.title,
        createdAt: savedTodo.createdAt
      }
    });
    
    res.status(201).json(savedTodo);
  } catch (error) {
    logger.error('创建待办事项失败', {
      error,
      metadata: {
        operation: LOG_OPERATIONS.CREATE_TODO,
        title: req.body.title
      }
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
        metadata: {
          operation: LOG_OPERATIONS.UPDATE_TODO,
          todoId: id,
          requestBody: req.body
        }
      });
      return res.status(404).json({ error: '待办事项不存在' });
    }
    
    logger.info('更新待办事项成功', {
      metadata: {
        operation: LOG_OPERATIONS.UPDATE_TODO,
        todoId: id,
        changes: {
          title: title !== undefined ? title : undefined,
          completed: completed !== undefined ? completed : undefined
        },
        updatedTodo: {
          title: updatedTodo.title,
          completed: updatedTodo.completed,
          updatedAt: updatedTodo.updatedAt
        }
      }
    });
    
    res.json(updatedTodo);
  } catch (error) {
    logger.error('更新待办事项失败', {
      error,
      metadata: {
        operation: LOG_OPERATIONS.UPDATE_TODO,
        todoId: req.params.id,
        requestBody: req.body
      }
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
        metadata: {
          operation: LOG_OPERATIONS.DELETE_TODO,
          todoId: id
        }
      });
      return res.status(404).json({ error: '待办事项不存在' });
    }
    
    logger.info('删除待办事项成功', {
      metadata: {
        operation: LOG_OPERATIONS.DELETE_TODO,
        todoId: id,
        deletedTodo: {
          title: deletedTodo.title,
          completed: deletedTodo.completed,
          createdAt: deletedTodo.createdAt
        }
      }
    });
    
    res.json({ message: '待办事项已删除' });
  } catch (error) {
    logger.error('删除待办事项失败', {
      error,
      metadata: {
        operation: LOG_OPERATIONS.DELETE_TODO,
        todoId: req.params.id
      }
    });
    res.status(500).json({ error: '删除待办事项失败' });
  }
});

module.exports = router; 