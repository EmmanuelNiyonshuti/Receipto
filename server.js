import express from 'express';
import router from './routes/index.js';
import logger from './middleware/logger.js';
import { errorHandler, JsonErrorHandler } from './middleware/error.js';
import { notFound } from './middleware/notFound.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {swaggerDocument, options} from './docs/swaggerDoc.js';

const port = process.env.PORT || 3000;
const app = express();

const swaggerDocs = swaggerJSDoc(swaggerDocument);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, options));

app.use(logger);
app.use(JsonErrorHandler);

app.use("/api", router);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
