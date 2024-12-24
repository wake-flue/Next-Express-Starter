const path = require("path");
require("dotenv").config({
    path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}`),
});

const appConfig = require("./modules/app");
const dbConfig = require("./modules/db");
const loggerConfig = require("./modules/logger");
const swaggerConfig = require("./modules/swagger");

const config = {
    app: appConfig,
    db: dbConfig,
    logger: loggerConfig,
    swagger: swaggerConfig,
};

module.exports = config;
