const Todo = require("../models/TodoModel");
const BaseService = require("./BaseService");
const PaginationUtils = require("../utils/paginationUtils");

class TodoService extends BaseService {
    constructor() {
        super(Todo);
        this.validSortFields = ['title', 'createdAt', 'completed'];
    }

    // 构建Todo查询条件
    _buildTodoQuery(filters = {}) {
        const query = {};
        const cleanFilters = PaginationUtils.cleanQueryParams(filters);

        if (cleanFilters.completed !== undefined) {
            query.completed = cleanFilters.completed === "true";
        }
        if (cleanFilters.title) {
            query.title = { $regex: cleanFilters.title, $options: "i" };
        }

        return query;
    }

    async getTodos(filters = {}, pagination = {}) {
        const query = this._buildTodoQuery(filters);
        const result = await this.findWithPagination(query, pagination, this.validSortFields);
        return {
            ...result,
            filters: PaginationUtils.cleanQueryParams(filters)
        };
    }

    async createTodo(todoData) {
        return await this.create({
            title: todoData.title,
            completed: todoData.completed || false,
        });
    }

    async updateTodo(id, todoData) {
        const updateData = {
            title: todoData.title,
            completed: todoData.completed,
        };

        // 移除未定义的字段
        Object.keys(updateData).forEach(
            (key) => updateData[key] === undefined && delete updateData[key]
        );

        return await this.update(id, updateData);
    }

    async deleteTodo(id) {
        return await this.delete(id);
    }
}

module.exports = new TodoService();
