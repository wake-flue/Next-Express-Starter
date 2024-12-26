const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const operationMiddleware = require("../middleware/operationMiddleware");

/**
 * 获取待办列表
 */
router.get("/", operationMiddleware.setOperation("GET_TODOS", "Todo"), todoController.getTodos);

/**
 * 创建待办事项
 */
router.post("/", operationMiddleware.setOperation("CREATE_TODO", "Todo"), todoController.createTodo);

/**
 * 更新待办事项
 */
router.put("/:id", operationMiddleware.setOperation("UPDATE_TODO", "Todo"), todoController.updateTodo);

/**
 * 删除待办事项
 */
router.delete("/:id", operationMiddleware.setOperation("DELETE_TODO", "Todo"), todoController.deleteTodo);

module.exports = router;
