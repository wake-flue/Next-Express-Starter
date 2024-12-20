const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

/**
 * @swagger
 * /api/v1/logs:
 *   post:
 *     summary: 接收前端日志
 *     tags: [Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               logs:
 *                 type: array
 *                 items:
 *                   type: object
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
 *         description: 日志接收成功
 *       400:
 *         description: 请求格式错误
 */
router.post('/', logController.addLogs);

/**
 * @swagger
 * /api/v1/logs:
 *   get:
 *     summary: 查询日志
 *     tags: [Logs]
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [error, warn, info, http, debug]
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *           enum: [frontend, backend]
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *       - in: query
 *         name: errorType
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       200:
 *         description: 查询成功
 *       400:
 *         description: 参数错误
 *       500:
 *         description: 服务器错误
 */
router.get('/', logController.queryLogs);

module.exports = router; 