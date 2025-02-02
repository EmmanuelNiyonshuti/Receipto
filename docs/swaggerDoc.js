export const swaggerDocument = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Receipts management RESTful API',
      version: '1.0.0',
      description: 'API documentation for Receipts management',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Status', description: 'API status and Statistics' },
      { name: 'User Authentication', description: 'User registration, login, and authentication'},
      {name: 'Receipts Management', description: 'Endpoints for managing receipts' },
    ],
  },
  apis: ['./src/api/routes/*.js'],
};

export const options = {
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
    tryItOutEnabled: true,
    displayRequestDuration: true
  }
};
