import express from 'express';
import router from './routes/index.js';
import logger from './middleware/logger.js';
import { errorHandler, JsonErrorHandler, multerError } from './middleware/error.js';
import { notFound } from './middleware/notFound.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {swaggerDocument, options} from './docs/swaggerDoc.js';
import cors from 'cors';

const port = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const swaggerDocs = swaggerJSDoc({
    ...swaggerDocument,
    swaggerDefinition: {
      ...swaggerDocument.swaggerDefinition,
      servers: [
        {
          url: '/',
          description: 'Development Server'
        }
      ]
    }
  });
const swaggerUiOptions = {
  ...options,
  swaggerOptions: {
    persistAuthorization: true,
    tryItOutEnabled: true,
    displayRequestDuration: true
  }
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions));
    
app.use(logger);
app.use(JsonErrorHandler);
app.use(multerError);

app.use('/api', router);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
