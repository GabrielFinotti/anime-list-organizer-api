import mongoose, { MongooseError } from 'mongoose';
import StartEnv from '../../env/startEnv.config.js';

class MongoConfig {
  static async newConnection() {
    try {
      const { MONGO_URI, MONGO_NAME } = StartEnv.getInstance().value;

      const hasDbInUrl = /\/[^\/?]+(\?|$)/.test(MONGO_URI);
      const fullUrl = hasDbInUrl ? MONGO_URI : `${MONGO_URI}/${MONGO_NAME}`;

      console.log('Connecting to MongoDB with:', fullUrl);

      await mongoose.connect(fullUrl);

      console.log('Connected to MongoDB, database:', MONGO_NAME);
    } catch (error) {
      if (error instanceof MongooseError) {
        throw new Error(`Mongoose connection error: ${error.message}`);
      }

      throw new Error(`Unexpected error: ${(error as Error).message}`);
    }
  }
}

export default MongoConfig;
