/**
 * @swagger
 * components:
 *   schemas:
 *     Log:
 *       type: object
 *       required:
 *         - level
 *         - message
 *         - meta
 *       properties:
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: 日志时间戳
 *         level:
 *           type: string
 *           enum: [error, warn, info, http, verbose, debug, silly]
 *           description: 日志级别
 *         message:
 *           type: string
 *           description: 日志消息
 *         meta:
 *           type: object
 *           required:
 *             - source
 *             - environment
 *           properties:
 *             operation:
 *               type: string
 *               description: 操作类型
 *             model:
 *               type: string
 *               description: 相关模型
 *             source:
 *               type: string
 *               enum: [frontend, backend]
 *               description: 来源
 *             environment:
 *               type: string
 *               enum: [development, production]
 *               description: 环境
 *             requestInfo:
 *               type: object
 *               properties:
 *                 method:
 *                   type: string
 *                   description: HTTP方法
 *                 url:
 *                   type: string
 *                   description: 请求URL
 *                 ip:
 *                   type: string
 *                   description: 客户端IP
 *                 headers:
 *                   type: object
 *                   description: 请求头
 *                 query:
 *                   type: object
 *                   description: 查询参数
 *             responseInfo:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: HTTP状态码
 *                 message:
 *                   type: string
 *                   description: 响应消息
 *                 duration:
 *                   type: number
 *                   description: 响应时间(ms)
 *             error:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: 错误名称
 *                 message:
 *                   type: string
 *                   description: 错误消息
 *                 stack:
 *                   type: string
 *                   description: 错误堆栈
 *             client:
 *               type: object
 *               properties:
 *                 browser:
 *                   type: string
 *                   description: 浏览器
 *                 os:
 *                   type: string
 *                   description: 操作系统
 *                 device:
 *                   type: string
 *                   description: 设备
 *                 url:
 *                   type: string
 *                   description: 客户端URL
 *             additionalData:
 *               type: object
 *               description: 其他元数据
 * 
 *     LogList:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Log'
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               description: 总数量
 *             page:
 *               type: integer
 *               description: 当前页码
 *             pageSize:
 *               type: integer
 *               description: 每页数量
 *             totalPages:
 *               type: integer
 *               description: 总页数
 *         filters:
 *           type: object
 *           properties:
 *             level:
 *               type: string
 *               description: 日志级别
 *             source:
 *               type: string
 *               description: 来源
 *             status:
 *               type: integer
 *               description: HTTP状态码
 *             operation:
 *               type: string
 *               description: 操作类型
 *             errorType:
 *               type: string
 *               description: 错误类型
 *             startTime:
 *               type: string
 *               format: date-time
 *               description: 开始时间
 *             endTime:
 *               type: string
 *               format: date-time
 *               description: 结束时间
 *             search:
 *               type: string
 *               description: 搜索关键词
 *             environment:
 *               type: string
 *               description: 环境
 *         sort:
 *           type: object
 *           properties:
 *             sortBy:
 *               type: string
 *               enum: [timestamp, level, message]
 *               description: 排序字段
 *             sortOrder:
 *               type: string
 *               enum: [asc, desc]
 *               description: 排序方向
 */

/**
 * @swagger
 * /api/v1/logs:
 *   get:
 *     tags: [Log]
 *     summary: 获取日志列表
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/pageSizeParam'
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [timestamp, level, message]
 *           default: timestamp
 *         description: 排序字段
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: 排序方向
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [error, warn, info, http, verbose, debug, silly]
 *         description: 日志级别过滤
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *           enum: [frontend, backend]
 *         description: 来源过滤
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: HTTP状态码过滤
 *       - in: query
 *         name: operation
 *         schema:
 *           type: string
 *         description: 操作类型过滤
 *       - in: query
 *         name: errorType
 *         schema:
 *           type: string
 *         description: 错误类型过滤
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
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *       - in: query
 *         name: environment
 *         schema:
 *           type: string
 *           enum: [development, production]
 *         description: 环境过滤
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/LogList'
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 *   post:
 *     tags: [Log]
 *     summary: 创建日志
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - level
 *                 - message
 *                 - meta
 *               properties:
 *                 level:
 *                   type: string
 *                   enum: [error, warn, info, http, verbose, debug, silly]
 *                   description: 日志级别
 *                 message:
 *                   type: string
 *                   description: 日志消息
 *                 meta:
 *                   type: object
 *                   required:
 *                     - source
 *                     - environment
 *                   properties:
 *                     operation:
 *                       type: string
 *                       description: 操作类型
 *                     source:
 *                       type: string
 *                       enum: [frontend, backend]
 *                       description: 来源
 *                     environment:
 *                       type: string
 *                       enum: [development, production]
 *                       description: 环境
 *     responses:
 *       201:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Log'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

module.exports = {}; 