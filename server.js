import express from 'express';
import router from './routes/index.js';
import logger from './middleware/logger.js';
import { errorHandler } from './middleware/error.js';
import { notFound } from './middleware/notFound.js';

const port = process.env.PORT || 3000;
const app = express();
// middleware
app.use(logger);
app.use(express.json());
app.use("/api", router);
// error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
