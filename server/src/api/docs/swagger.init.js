/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: 用户认证
 *   - name: User
 *     description: 用户管理
 *   - name: Todo
 *     description: 待办事项管理
 *   - name: Log
 *     description: 系统日志
 *
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: 状态码
 *         data:
 *           type: object
 *           description: 响应数据
 *         message:
 *           type: string
 *           description: 响应信息
 *
 *     PageInfo:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: 当前页码
 *         pageSize:
 *           type: integer
 *           description: 每页数量
 *         total:
 *           type: integer
 *           description: 总数量
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT令牌
 *
 *   parameters:
 *     pageParam:
 *       in: query
 *       name: page
 *       schema:
 *         type: integer
 *         default: 1
 *         minimum: 1
 *       description: 页码
 *
 *     pageSizeParam:
 *       in: query
 *       name: pageSize
 *       schema:
 *         type: integer
 *         default: 20
 *         minimum: 1
 *         maximum: 100
 *       description: 每页数量
 */

module.exports = {};
