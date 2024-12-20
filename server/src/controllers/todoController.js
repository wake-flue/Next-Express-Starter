const todoService = require('../services/todoService');
const config = require('../config');
const logger = config.logger;
const ResponseHandler = require('../utils/responseHandler');

// 定义日志操作类型
const LOG_OPERATIONS = {
  GET_TODOS: 'GET_TODOS',
  CREATE_TODO: 'CREATE_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  DELETE_TODO: 'DELETE_TODO'
};

class TodoController {
  async getAllTodos(req, res) {
    try {
      const todos = await todoService.getAllTodos();
      return ResponseHandler.success(res, todos);
    } catch (error) {
      logger.error(`${LOG_OPERATIONS.GET_TODOS} - Error: ${error.message}`);
      return ResponseHandler.error(res, 'Error fetching todos');
    }
  }

  async createTodo(req, res) {
    try {
      const todo = await todoService.createTodo(req.body);
      return ResponseHandler.created(res, todo);
    } catch (error) {
      logger.error(`${LOG_OPERATIONS.CREATE_TODO} - Error: ${error.message}`);
      return ResponseHandler.error(res, 'Error creating todo');
    }
  }

  async updateTodo(req, res) {
    try {
      const todo = await todoService.updateTodo(req.params.id, req.body);
      if (!todo) {
        return ResponseHandler.notFound(res, 'Todo not found');
      }
      return ResponseHandler.success(res, todo);
    } catch (error) {
      logger.error(`${LOG_OPERATIONS.UPDATE_TODO} - Error: ${error.message}`);
      return ResponseHandler.error(res, 'Error updating todo');
    }
  }

  async deleteTodo(req, res) {
    try {
      const result = await todoService.deleteTodo(req.params.id);
      if (!result) {
        return ResponseHandler.notFound(res, 'Todo not found');
      }
      return ResponseHandler.success(res, null, 204);
    } catch (error) {
      logger.error(`${LOG_OPERATIONS.DELETE_TODO} - Error: ${error.message}`);
      return ResponseHandler.error(res, 'Error deleting todo');
    }
  }
}

module.exports = new TodoController(); 