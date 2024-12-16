const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Next-Express-Starter API Documentation',
      version: '1.0.0',
      description: 'API documentation for Next-Express-Starter project',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: process.env.SWAGGER_URL || 'http://localhost:3001',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  // 指定API路由文件位置
  apis: ['./routes/*.js', './index.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec; 