const ResponseHandler = require("../utils/responseHandler");
const PaginationUtils = require("../utils/paginationUtils");

class BaseController {
    constructor(service) {
        this.service = service;
    }

    // 通用列表查询方法
    async list(req, res, next) {
        try {
            const paginationParams = PaginationUtils.processPaginationParams(req.query);
            const filters = PaginationUtils.cleanQueryParams(req.query);
            const result = await this.service.findWithPagination(filters, paginationParams);
            return ResponseHandler.success(res, result);
        } catch (error) {
            next(error);
        }
    }

    // 通用详情查询方法
    async detail(req, res, next) {
        try {
            const result = await this.service.findById(req.params.id);
            if (!result) {
                return ResponseHandler.notFound(res, "资源不存在");
            }
            return ResponseHandler.success(res, result);
        } catch (error) {
            next(error);
        }
    }

    // 通用创建方法
    async create(req, res, next) {
        try {
            const result = await this.service.create(req.body);
            return ResponseHandler.created(res, result);
        } catch (error) {
            next(error);
        }
    }

    // 通用更新方法
    async update(req, res, next) {
        try {
            const result = await this.service.update(req.params.id, req.body);
            if (!result) {
                return ResponseHandler.notFound(res, "资源不存在");
            }
            return ResponseHandler.success(res, result);
        } catch (error) {
            next(error);
        }
    }

    // 通用删除方法
    async delete(req, res, next) {
        try {
            const result = await this.service.delete(req.params.id);
            if (!result) {
                return ResponseHandler.notFound(res, "资源不存在");
            }
            return ResponseHandler.success(res, null);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = BaseController;
