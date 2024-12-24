const LogHandler = require("../utils/logHandler");

const loggerMiddleware = (req, res, next) => {
    const start = new Date();

    res.on("finish", () => {
        const duration = new Date() - start;

        const requestInfo = {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            headers: req.headers,
            query: req.query,
        };

        const responseInfo = {
            status: res.statusCode,
            message: res.statusMessage,
            duration,
        };

        const metadata = {
            operation: req.operation,
        };

        LogHandler.logRequest(requestInfo, responseInfo, metadata);
    });

    next();
};

module.exports = loggerMiddleware;
