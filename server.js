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

app.use(cors());

const swaggerDocs = swaggerJSDoc(swaggerDocument);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, options));

app.use(logger);
app.use(JsonErrorHandler);
app.use(multerError);

app.use('/api', router);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
