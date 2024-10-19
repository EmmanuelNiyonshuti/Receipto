import express from 'express';
import router from './routes/index.js';
import logger from './middleware/logger.js';

const port = process.env.PORT || 3000;

const app = express();

// middlewares
app.use(logger);

app.use(express.json());
app.use("/api", router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
