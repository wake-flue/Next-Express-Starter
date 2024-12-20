/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: 用户认证相关接口
 *   - name: Users
 *     description: 用户管理相关接口
 *   - name: Todos
 *     description: 待办事项相关接口
 *   - name: Logs
 *     description: 日志相关接口
 * 
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: 错误码
 *         message:
 *           type: string
 *           description: 错误信息
 *     
 *     Success:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: 状态码
 *         data:
 *           type: object
 *           description: 返回数据
 *         message:
 *           type: string
 *           description: 成功信息
 *     
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: 当前页码
 *         limit:
 *           type: integer
 *           description: 每页数量
 *         total:
 *           type: integer
 *           description: 总数量
 *     
 *     Todo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 待办事项ID
 *         title:
 *           type: string
 *           description: 标题
 *         content:
 *           type: string
 *           description: 内容
 *         completed:
 *           type: boolean
 *           description: 是否完成
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: 请在此输入JWT token
 * 
 *   parameters:
 *     pageParam:
 *       in: query
 *       name: page
 *       schema:
 *         type: integer
 *         default: 1
 *       description: 页码
 *     
 *     limitParam:
 *       in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         default: 10
 *       description: 每页数量
 */

// 导出一个空对象，这个文件主要用于swagger文档注释
module.exports = {}; 