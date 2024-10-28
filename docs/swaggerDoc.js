export const swaggerDocument = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Receipt management REST API',
        version: '1.0.0',
        description: 'API documentation for Receipto',
      },
      servers: [
        {
          url: `http://127.0.0.1:${process.env.PORT || 3000}`,
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          Receipt: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'Unique identifier for the receipt',
              },
              filename: {
                type: 'string',
                description: 'The name of the uploaded receipt file',
              },
              fileUrl: {
                type: 'string',
                description: 'The URL of the uploaded receipt file',
              },
              metadata: {
                type: 'object',
                properties: {
                  date: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Date of the transaction',
                  },
                  amount: {
                    type: 'number',
                    description: 'Amount spent in the transaction',
                  },
                  category: {
                    type: 'string',
                    description: 'Category of the transaction',
                  },
                },
              },
            },
          },
          CreateReceipt: {
            type: 'object',
            required: ['filename', 'metadata'],
            properties: {
              filename: {
                type: 'string',
                description: 'The name of the uploaded receipt file',
              },
              metadata: {
                type: 'object',
                properties: {
                  date: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Date of the transaction',
                  },
                  amount: {
                    type: 'number',
                    description: 'Amount spent in the transaction',
                  },
                  category: {
                    type: 'string',
                    description: 'Category of the transaction',
                  },
                },
              },
            },
          },
        },
      },
    },
    apis: ['./routes/*.js'],
  };

export const options = {
  customCss: '.swagger-ui .topbar {display: none }',
};

