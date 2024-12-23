const path = require('path');

const swaggerConfig = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: process.env.API_TITLE || 'Next-Express-Starter API',
      version: process.env.SWAGGER_VERSION || '1.0.0',
      description: 'API documentation for Next-Express-Starter project',
      contact: {
        name: process.env.API_CONTACT_NAME || 'API Support',
        email: process.env.API_CONTACT_EMAIL || 'support@example.com',
        url: process.env.API_CONTACT_URL || 'https://github.com/your-username/next-express-starter'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3001',
        description: 'Development server'
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
  apis: [
    path.join(__dirname, '../../api/docs/swagger.init.js'),
    path.join(__dirname, '../../api/**/*.js'),
    path.join(__dirname, '../../app.js')
  ]
};

module.exports = swaggerConfig; 