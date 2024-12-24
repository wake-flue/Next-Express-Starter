const todoService = require('../services/todoService');
const ResponseHandler = require('../utils/responseHandler');
const BaseController = require('./BaseController');

class TodoController extends BaseController {
  constructor() {
    super();
    this.getTodos = this.getTodos.bind(this);
    this.createTodo = this.createTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
  }

  async getTodos(req, res) {
    try {
      const { ...filters } = req.query;
      const paginationParams = this.getPaginationParams(req.query);

      const result = await todoService.getTodos(filters, paginationParams);
      return ResponseHandler.success(res, result);
    } catch (error) {
      return ResponseHandler.error(res, 'Error fetching todos');
    }
  }

  async createTodo(req, res) {
    try {
      const todo = await todoService.createTodo(req.body);
      return ResponseHandler.created(res, todo);
    } catch (error) {
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
      return ResponseHandler.error(res, 'Error updating todo');
    }
  }

  async deleteTodo(req, res) {
    try {
      const result = await todoService.deleteTodo(req.params.id);
      if (!result) {
        return ResponseHandler.notFound(res, 'Todo not found');
      }
      return ResponseHandler.success(res, null);
    } catch (error) {
      return ResponseHandler.error(res, 'Error deleting todo');
    }
  }
}

module.exports = new TodoController(); 