import express from 'express';
import MongoConfig from './infrastructure/database/config/mongo.config.js';
import StartEnv from './infrastructure/env/startEnv.config.js';

const env = StartEnv.getInstance();
const app = express();

app.use(express.json());

const startServer = async () => {
  try {
    await MongoConfig.newConnection(env.env.MONGO_URI, 'anime_list');

    app.listen(Number(env.env.PORT), () => {
      console.log(`Server running on port ${env.env.PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to start server:', error.message);
    } else {
      console.error('Failed to start server:', error);
    }
  }
};

startServer();
