import express from 'express';
import router from './routes/index.js';
import logger from './middleware/logger.js';
import { errorHandler, JsonErrorHandler } from './middleware/error.js';
import { notFound } from './middleware/notFound.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const port = process.env.PORT || 3000;
const app = express();

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Receipt management Restful API',
            version: '1.0.0',
            description: 'API documentation using swagger',
        },
        servers: [
            {
                url: `http://127.0.0.1:${port}`,
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
        },
    },
    apis: ['./routes/*.js'], // path to API docs
};
const options = {
    customCss: '.swagger-ui .topbar {display: none }',
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, options));

app.use(logger);
app.use(JsonErrorHandler);

app.use("/api", router);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
