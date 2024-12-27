const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const operationMiddleware = require("../middleware/operationMiddleware");

/**
 * 获取待办列表
 */
router.get("/", operationMiddleware.setOperation("GET_TODOS", "Todo"), todoController.list.bind(todoController));

/**
 * 获取待办详情
 */
router.get("/:id", operationMiddleware.setOperation("GET_TODO_DETAIL", "Todo"), todoController.detail.bind(todoController));

/**
 * 创建待办事项
 */
router.post("/", operationMiddleware.setOperation("CREATE_TODO", "Todo"), todoController.create.bind(todoController));

/**
 * 更新待办事项
 */
router.put("/:id", operationMiddleware.setOperation("UPDATE_TODO", "Todo"), todoController.update.bind(todoController));

/**
 * 删除待办事项
 */
router.delete("/:id", operationMiddleware.setOperation("DELETE_TODO", "Todo"), todoController.delete.bind(todoController));

module.exports = router;
