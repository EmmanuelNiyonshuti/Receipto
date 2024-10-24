import express from 'express';
import router from './routes/index.js';
import logger from './middleware/logger.js';
import { errorHandler, JsonErrorHandler } from './middleware/error.js';
import { notFound } from './middleware/notFound.js';

const port = process.env.PORT || 3000;
const app = express();
// middleware
app.use(logger);
app.use(JsonErrorHandler);

app.use("/api", router);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
