import express from 'express';
import MongoConfig from './infrastructure/database/config/mongo.config.js';
import RedisClient from './infrastructure/cache/redis.client.js';
import StartEnv from './infrastructure/env/startEnv.config.js';

const env = StartEnv.getInstance();
const app = express();

app.use(express.json());

const startServer = async () => {
  try {
    await MongoConfig.newConnection();

    await RedisClient.getInstance().connect();

    app.listen(Number(env.value.PORT), () => {
      console.log(`Server running on port ${env.value.PORT}`);
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
