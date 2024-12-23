const todoService = require('../services/todoService');
const ResponseHandler = require('../utils/responseHandler');
const BaseController = require('./BaseController');

const LOG_OPERATIONS = {
  GET_TODOS: 'GET_TODOS',
  CREATE_TODO: 'CREATE_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  DELETE_TODO: 'DELETE_TODO'
};

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
      return ResponseHandler.success(res, result, {
        ...this.formatBaseMetadata(req, LOG_OPERATIONS.GET_TODOS),
        filters,
        pagination: this.formatPaginationMetadata(paginationParams, result.total)
      });
    } catch (error) {
      return ResponseHandler.error(res, 'Error fetching todos', {
        ...this.formatBaseMetadata(req, LOG_OPERATIONS.GET_TODOS),
        error,
        query: req.query
      });
    }
  }

  async createTodo(req, res) {
    try {
      const todo = await todoService.createTodo(req.body);
      return ResponseHandler.created(res, todo, {
        ...this.formatBaseMetadata(req, LOG_OPERATIONS.CREATE_TODO),
        todoId: todo.id,
        todoTitle: todo.title
      });
    } catch (error) {
      return ResponseHandler.error(res, 'Error creating todo', {
        ...this.formatBaseMetadata(req, LOG_OPERATIONS.CREATE_TODO),
        error,
        todoData: {
          title: req.body.title,
          priority: req.body.priority
        }
      });
    }
  }

  async updateTodo(req, res) {
    try {
      const todo = await todoService.updateTodo(req.params.id, req.body);
      if (!todo) {
        return ResponseHandler.notFound(res, 'Todo not found', {
          ...this.formatBaseMetadata(req, LOG_OPERATIONS.UPDATE_TODO),
          todoId: req.params.id
        });
      }
      return ResponseHandler.success(res, todo, {
        ...this.formatBaseMetadata(req, LOG_OPERATIONS.UPDATE_TODO),
        todoId: req.params.id,
        changes: {
          title: req.body.title,
          completed: req.body.completed,
          priority: req.body.priority
        }
      });
    } catch (error) {
      return ResponseHandler.error(res, 'Error updating todo', {
        ...this.formatBaseMetadata(req, LOG_OPERATIONS.UPDATE_TODO),
        error,
        todoId: req.params.id,
        changes: {
          title: req.body.title,
          completed: req.body.completed,
          priority: req.body.priority
        }
      });
    }
  }

  async deleteTodo(req, res) {
    try {
      const result = await todoService.deleteTodo(req.params.id);
      if (!result) {
        return ResponseHandler.notFound(res, 'Todo not found', {
          ...this.formatBaseMetadata(req, LOG_OPERATIONS.DELETE_TODO),
          todoId: req.params.id
        });
      }
      return ResponseHandler.success(res, null, {
        ...this.formatBaseMetadata(req, LOG_OPERATIONS.DELETE_TODO),
        todoId: req.params.id
      });
    } catch (error) {
      return ResponseHandler.error(res, 'Error deleting todo', {
        ...this.formatBaseMetadata(req, LOG_OPERATIONS.DELETE_TODO),
        error,
        todoId: req.params.id
      });
    }
  }
}

module.exports = new TodoController(); 