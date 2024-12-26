const todoService = require("../services/todoService");
const ResponseHandler = require("../utils/responseHandler");
const BaseController = require("./BaseController");
const PaginationUtils = require("../utils/paginationUtils");

class TodoController extends BaseController {
    constructor() {
        super(todoService);
        this.getTodos = this.getTodos.bind(this);
        this.createTodo = this.createTodo.bind(this);
        this.updateTodo = this.updateTodo.bind(this);
        this.deleteTodo = this.deleteTodo.bind(this);
    }

    async getTodos(req, res, next) {
        try {
            const paginationParams = PaginationUtils.processPaginationParams(req.query);
            const filters = PaginationUtils.cleanQueryParams(req.query);

            const result = await this.service.getTodos(filters, paginationParams);
            return ResponseHandler.success(res, result);
        } catch (error) {
            next(error);
        }
    }

    async createTodo(req, res, next) {
        try {
            const todo = await this.service.createTodo(req.body);
            return ResponseHandler.created(res, todo);
        } catch (error) {
            next(error);
        }
    }

    async updateTodo(req, res, next) {
        try {
            const todo = await this.service.updateTodo(req.params.id, req.body);
            if (!todo) {
                return ResponseHandler.notFound(res, "待办事项不存在");
            }
            return ResponseHandler.success(res, todo);
        } catch (error) {
            next(error);
        }
    }

    async deleteTodo(req, res, next) {
        try {
            const result = await this.service.deleteTodo(req.params.id);
            if (!result) {
                return ResponseHandler.notFound(res, "待办事项不存在");
            }
            return ResponseHandler.success(res, null);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TodoController();
