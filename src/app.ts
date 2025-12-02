import express from 'express';
import routes from './presentation/http/routes/index.js';
import errorHandler from './presentation/http/middlewares/errorHandler.middleware.js';

const app = express();

app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

export default app;
