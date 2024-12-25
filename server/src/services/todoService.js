const Todo = require("../models/todo");

class TodoService {
    async getTodos(filters = {}, pagination = {}) {
        const { page = 1, pageSize = 20, sortBy = "createdAt", sortOrder = "desc" } = pagination;

        // 构建查询条件
        const query = {};
        const cleanFilters = { ...filters };

        // 从filters中移除非过滤参数
        delete cleanFilters.page;
        delete cleanFilters.pageSize;
        delete cleanFilters.sortBy;
        delete cleanFilters.sortOrder;

        // 构建过滤条件
        if (cleanFilters.completed !== undefined) {
            query.completed = cleanFilters.completed === "true";
        }
        if (cleanFilters.title) {
            query.title = { $regex: cleanFilters.title, $options: "i" };
        }

        // 构建排序对象
        const sort = {
            [sortBy]: sortOrder === "desc" ? -1 : 1,
        };

        // 计算总数
        const total = await Todo.countDocuments(query);

        // 获取分页数据
        const data = await Todo.find(query)
            .sort(sort)
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return {
            data,
            pagination: {
                total,
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                totalPages: Math.ceil(total / pageSize),
            },
            filters: cleanFilters,
        };
    }

    async createTodo(todoData) {
        const todo = new Todo({
            title: todoData.title,
            completed: todoData.completed || false,
        });

        return await todo.save();
    }

    async updateTodo(id, todoData) {
        const updateData = {
            title: todoData.title,
            completed: todoData.completed,
        };

        // 移除未定义的字段
        Object.keys(updateData).forEach(
            (key) => updateData[key] === undefined && delete updateData[key],
        );

        return Todo.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    async deleteTodo(id) {
        return Todo.findByIdAndDelete(id);
    }
}

module.exports = new TodoService();
