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
 *           description: Todo ID
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: 待办事项标题
 *         completed:
 *           type: boolean
 *           default: false
 *           description: 完成状态
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 * 
 *     TodoList:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Todo'
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
 *             completed:
 *               type: boolean
 *               description: 完成状态过滤
 *             title:
 *               type: string
 *               description: 标题搜索关键词
 *         sort:
 *           type: object
 *           properties:
 *             sortBy:
 *               type: string
 *               enum: [title, createdAt, completed]
 *               description: 排序字段
 *             sortOrder:
 *               type: string
 *               enum: [asc, desc]
 *               description: 排序方向
 */

/**
 * @swagger
 * /api/v1/todos:
 *   get:
 *     tags: [Todo]
 *     summary: 获取待办事项列表
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/pageSizeParam'
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, createdAt, completed]
 *           default: createdAt
 *         description: 排序字段
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: 排序方向
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: 完成状态过滤
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: 标题搜索关键词
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
 *                   $ref: '#/components/schemas/TodoList'
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 *   post:
 *     tags: [Todo]
 *     summary: 创建待办事项
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
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: 待办事项标题
 *               completed:
 *                 type: boolean
 *                 default: false
 *                 description: 完成状态
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
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * /api/v1/todos/{id}:
 *   put:
 *     tags: [Todo]
 *     summary: 更新待办事项
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: 待办事项标题
 *               completed:
 *                 type: boolean
 *                 description: 完成状态
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       404:
 *         description: 资源不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 *   delete:
 *     tags: [Todo]
 *     summary: 删除待办事项
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: null
 *       404:
 *         description: 资源不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

module.exports = {}; 