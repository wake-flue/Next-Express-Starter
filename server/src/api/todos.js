const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const operationMiddleware = require("../middleware/operationMiddleware");

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
 *           description: 待办事项ID
 *         title:
 *           type: string
 *           description: 待办事项标题
 *         completed:
 *           type: boolean
 *           description: 完成状态
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 */

/**
 * @swagger
 * /api/v1/todos:
 *   get:
 *     summary: 获取待办列表
 *     tags: [Todo]
 *     parameters:
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: 完成状态筛选
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 标题搜索
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: 开始时间
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: 结束时间
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, title]
 *           default: createdAt
 *         description: 排序字段
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: 排序方式
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: 每页数量
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Todo'
 *                     pageInfo:
 *                       $ref: '#/components/schemas/PageInfo'
 *                 message:
 *                   type: string
 *                   example: 获取成功
 *       500:
 *         description: 服务器错误
 */
router.get("/", operationMiddleware.setOperation("GET_TODOS", "Todo"), todoController.getTodos);

/**
 * @swagger
 * /api/v1/todos:
 *   post:
 *     summary: 创建待办事项
 *     tags: [Todo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: 创建成功
 *       400:
 *         description: 参数错误
 *       500:
 *         description: 服务器错误
 */
router.post("/", operationMiddleware.setOperation("CREATE_TODO", "Todo"), todoController.createTodo);

/**
 * @swagger
 * /api/v1/todos/{id}:
 *   put:
 *     summary: 更新待办事项
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 待办事项ID
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
 *         description: 更新成功
 *       400:
 *         description: 参数错误
 *       404:
 *         description: 待办事项不存在
 *       500:
 *         description: 服务器错误
 */
router.put("/:id", operationMiddleware.setOperation("UPDATE_TODO", "Todo"), todoController.updateTodo);

/**
 * @swagger
 * /api/v1/todos/{id}:
 *   delete:
 *     summary: 删除待办事项
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 待办事项ID
 *     responses:
 *       200:
 *         description: 删除成功
 *       404:
 *         description: 待办事项不存在
 *       500:
 *         description: 服务器错误
 */
router.delete("/:id", operationMiddleware.setOperation("DELETE_TODO", "Todo"), todoController.deleteTodo);

module.exports = router;
