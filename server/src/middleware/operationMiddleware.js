const generateOperation = (req) => {
    // 如果路由中已经定义了operation,则使用已定义的
    if (req.route && req.route.operation) {
        return req.route.operation;
    }

    // 根据HTTP方法和路径自动生成operation
    const method = req.method.toLowerCase();
    const path = req.route ? req.route.path : req.path;

    // 移除路径中的参数占位符
    const cleanPath = path.replace(/:[^/]+/g, "").replace(/\//g, "_");

    // 生成operation格式: method_path
    // 例如: get_users, post_users_create
    return `${method}${cleanPath}`;
};

const operationMiddleware = (options = {}) => {
    return (req, res, next) => {
        // 允许在路由级别自定义operation
        if (options.operation) {
            req.operation = options.operation;
        } else {
            // 自动生成operation
            req.operation = generateOperation(req);
        }
        next();
    };
};

// 用于在路由定义时设置operation的辅助函数
operationMiddleware.setOperation = (operation) => {
    return operationMiddleware({ operation });
};

module.exports = operationMiddleware;
