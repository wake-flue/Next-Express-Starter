const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Log:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: 日志ID
 *         level:
 *           type: string
 *           enum: [error, warn, info, http, debug]
 *           description: 日志级别
 *         message:
 *           type: string
 *           description: 日志信息
 *         source:
 *           type: string
 *           enum: [frontend, backend]
 *           description: 日志来源
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: 日志时间
 *         status:
 *           type: integer
 *           description: HTTP状态码
 *         errorType:
 *           type: string
 *           description: 错误类型
 *         error:
 *           type: object
 *           description: 错误详情
 *         client:
 *           type: object
 *           description: 客户端信息
 */

/**
 * @swagger
 * /api/v1/logs:
 *   get:
 *     summary: 查询日志
 *     tags: [Log]
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [error, warn, info, http, debug]
 *         description: 日志级别
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *           enum: [frontend, backend]
 *         description: 日志来源
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
 *         name: status
 *         schema:
 *           type: integer
 *         description: HTTP状态码
 *       - in: query
 *         name: errorType
 *         schema:
 *           type: string
 *         description: 错误类型
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词
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
 *         description: 查询成功
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
 *                         $ref: '#/components/schemas/Log'
 *                     pageInfo:
 *                       $ref: '#/components/schemas/PageInfo'
 *                 message:
 *                   type: string
 *                   example: 查询成功
 *       400:
 *         description: 参数错误
 *       500:
 *         description: 服务器错误
 */
router.get("/", logController.getLogs);

/**
 * @swagger
 * /api/v1/logs:
 *   post:
 *     summary: 创建日志
 *     tags: [Log]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - logs
 *             properties:
 *               logs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - level
 *                     - message
 *                   properties:
 *                     level:
 *                       type: string
 *                       enum: [error, warn, info, debug]
 *                     message:
 *                       type: string
 *                     error:
 *                       type: object
 *                     client:
 *                       type: object
 *     responses:
 *       200:
 *         description: 创建成功
 *       400:
 *         description: 请求参数错误
 *       500:
 *         description: 服务器错误
 */
router.post("/", logController.createLogs);

module.exports = router;
