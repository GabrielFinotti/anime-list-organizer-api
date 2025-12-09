import express from 'express';
import cors from 'cors';
import routes from './presentation/http/routes/index.js';
import errorHandler from './presentation/http/middlewares/errorHandler.middleware.js';
import StartEnv from './infrastructure/env/startEnv.config.js';

const app = express();
const env = StartEnv.getInstance();

app.use(express.json());

app.use(
  cors({
    origin: env.value.CORS_ORIGINS,
  }),
);

app.use('/api', routes);

app.use(errorHandler);

export default app;
