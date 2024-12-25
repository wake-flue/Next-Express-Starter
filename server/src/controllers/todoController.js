const todoService = require("../services/todoService");
const ResponseHandler = require("../utils/responseHandler");
const BaseController = require("./BaseController");

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
            return ResponseHandler.error(res, "获取待办事项失败", error);
        }
    }

    async createTodo(req, res) {
        try {
            const todo = await todoService.createTodo(req.body);
            return ResponseHandler.created(res, todo);
        } catch (error) {
            return ResponseHandler.error(res, "创建待办事项失败", error);
        }
    }

    async updateTodo(req, res) {
        try {
            const todo = await todoService.updateTodo(req.params.id, req.body);
            if (!todo) {
                return ResponseHandler.notFound(res, "待办事项不存在", new Error("待办事项不存在"));
            }
            return ResponseHandler.success(res, todo);
        } catch (error) {
            return ResponseHandler.error(res, "更新待办事项失败", error);
        }
    }

    async deleteTodo(req, res) {
        try {
            const result = await todoService.deleteTodo(req.params.id);
            if (!result) {
                return ResponseHandler.notFound(res, "待办事项不存在", new Error("待办事项不存在"));
            }
            return ResponseHandler.success(res, null);
        } catch (error) {
            return ResponseHandler.error(res, "删除待办事项失败", error);
        }
    }
}

module.exports = new TodoController();
