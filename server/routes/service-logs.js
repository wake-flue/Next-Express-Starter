const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
const Log = require('../models/Log');

// 定义日志操作类型
const LOG_OPERATIONS = {
  GET_LOGS: 'GET_LOGS',
  POST_LOGS: 'POST_LOGS'
};

/**
 * @swagger
 * /api/v1/service-logs:
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
router.post('/', async (req, res) => {
  try {
    const { logs } = req.body;
    
    if (!Array.isArray(logs)) {
      return res.status(400).json({ error: '无效的日志格式' });
    }

    // 批量处理日志
    const logPromises = logs.map(logData => {
      const { level, message, error, client, ...rest } = logData;
      
      return Log.addLog({
        level,
        message,
        source: 'frontend',
        error,
        client,
        metadata: rest,
        request: {
          userAgent: req.get('user-agent'),
          ip: req.ip,
          host: req.get('host')
        }
      });
    });

    await Promise.all(logPromises);
    res.status(200).json({ message: '日志接收成功' });
  } catch (error) {
    logger.error('处理前端日志时出错:', { error });
    res.status(500).json({ error: '服务器内部错误' });
  }
});

/**
 * @swagger
 * /api/v1/service-logs:
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
router.get('/', async (req, res) => {
  try {
    const {
      level,
      source,
      startTime,
      endTime,
      status,
      errorType,
      search,
      page,
      pageSize,
      sort
    } = req.query;

    // 使用 Log 模型的查询方法
    const result = await Log.queryLogs(
      {
        level,
        source,
        startTime,
        endTime,
        status: status ? parseInt(status) : undefined,
        errorType,
        search
      },
      {
        page: page ? parseInt(page) : 1,
        pageSize: pageSize ? parseInt(pageSize) : 20,
        sort: sort ? JSON.parse(sort) : { timestamp: -1 }
      }
    );

    res.json(result);
    logger.info('查询日志成功', {
      metadata: {
        operation: LOG_OPERATIONS.GET_LOGS,
        query: req.query,
        count: result.logs.length
      }
    });
  } catch (error) {
    logger.error('查询日志时出错:', { error });
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router; 