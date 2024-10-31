export const swaggerDocument = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Receipt management REST API',
      version: '1.0.0',
      description: 'API documentation for Receipt management REST API',
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
