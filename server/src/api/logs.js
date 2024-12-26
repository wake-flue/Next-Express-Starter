const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const operationMiddleware = require("../middleware/operationMiddleware");

/**
 * 查询日志
 */
router.get("/", operationMiddleware.setOperation("GET_LOGS", "Log"), logController.getLogs);

/**
 * 创建日志
 */
router.post("/", operationMiddleware.setOperation("CREATE_LOGS", "Log"), logController.createLogs);

module.exports = router;
