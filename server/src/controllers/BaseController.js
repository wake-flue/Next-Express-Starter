class BaseController {
    // 处理分页参数
    getPaginationParams(query) {
        const { page = 1, pageSize = 20, sort = { createdAt: -1 } } = query;

        return {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            sort: typeof sort === "string" ? JSON.parse(sort) : sort,
        };
    }
}

module.exports = BaseController;
