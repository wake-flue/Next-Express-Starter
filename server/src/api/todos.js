const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *           description: Todo的唯一标识符
 *         title:
 *           type: string
 *           description: Todo的标题
 *         completed:
 *           type: boolean
 *           description: Todo的完成状态
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Todo的创建时间
 */

/**
 * @swagger
 * /api/v1/todos:
 *   get:
 *     summary: 获取所有待办事项
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: 成功获取待办事项列表
 */
router.get('/', todoController.getAllTodos);

/**
 * @swagger
 * /api/v1/todos:
 *   post:
 *     summary: 创建新的待办事项
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 */
router.post('/', todoController.createTodo);

/**
 * @swagger
 * /api/v1/todos/{id}:
 *   put:
 *     summary: 更新待办事项
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put('/:id', todoController.updateTodo);

/**
 * @swagger
 * /api/v1/todos/{id}:
 *   delete:
 *     summary: 删除待办事项
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', todoController.deleteTodo);

module.exports = router; 