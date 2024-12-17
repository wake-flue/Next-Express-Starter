const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

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
 *                     timestamp:
 *                       type: string
 *                     data:
 *                       type: object
 *                     userAgent:
 *                       type: string
 *                     url:
 *                       type: string
 *     responses:
 *       200:
 *         description: 日志接收成功
 *       400:
 *         description: 请求格式错误
 */
router.post('/', async (req, res) => {
  try {
    const { logs } = req.body;
    
    if (!Array.isArray(logs)) {
      return res.status(400).json({ error: '无效的日志格式' });
    }

    // 处理每条日志
    logs.forEach(log => {
      const { level, message, data } = log;
      
      // 使用对应的日志级别记录
      switch (level) {
        case 'error':
          logger.error(message, { ...data, source: 'frontend', ...log });
          break;
        case 'warn':
          logger.warn(message, { ...data, source: 'frontend', ...log });
          break;
        case 'info':
          logger.info(message, { ...data, source: 'frontend', ...log });
          break;
        case 'debug':
          logger.debug(message, { ...data, source: 'frontend', ...log });
          break;
        default:
          logger.info(message, { ...data, source: 'frontend', ...log });
      }
    });

    res.status(200).json({ message: '日志接收成功' });
  } catch (error) {
    logger.error('处理前端日志时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

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
 *           enum: [error, warn, info, debug]
 *         description: 日志级别
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *         description: 开始时间(ISO格式)
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *         description: 结束时间(ISO格式)
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
 *         description: 每页条数
 *     responses:
 *       200:
 *         description: 查询成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: 参数错误
 *       500:
 *         description: 服务器错误
 */
router.get('/', async (req, res) => {
  try {
    const { level, startTime, endTime, page = 1, pageSize = 20 } = req.query;
    
    // 构建查询条件
    const query = {};
    if (level) {
      query.level = level;
    }
    if (startTime || endTime) {
      query.timestamp = {};
      if (startTime) {
        query.timestamp.$gte = new Date(startTime);
      }
      if (endTime) {
        query.timestamp.$lte = new Date(endTime);
      }
    }

    // 获取MongoDB连接
    const db = logger.transports.find(t => t instanceof require('winston-mongodb').MongoDB).db;
    const collection = db.collection('logs');

    // 执行查询
    const total = await collection.countDocuments(query);
    const logs = await collection.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .toArray();

    res.json({
      total,
      logs: logs.map(log => ({
        ...log,
        _id: log._id.toString()
      }))
    });
  } catch (error) {
    logger.error('查询日志时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router; 