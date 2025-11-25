import mongoose, { MongooseError } from 'mongoose';

class MongoConfig {
  static async newConnection(url: string, dbName: string) {
    try {
      if (typeof url !== 'string' || url.length === 0) {
        throw new Error('Invalid MongoDB URL');
      }

      if (typeof dbName !== 'string' || dbName.length === 0) {
        throw new Error('Invalid Database Name');
      }
      
      const hasDbInUrl = /\/[^\/?]+(\?|$)/.test(url);
      const fullUrl = hasDbInUrl ? url : `${url}/${dbName}`;

      console.log('Connecting to MongoDB with:', fullUrl);

      await mongoose.connect(fullUrl);

      console.log('Connected to MongoDB, database:', dbName);
    } catch (error) {
      if (error instanceof MongooseError) {
        throw new Error(`Mongoose connection error: ${error.message}`);
      }

      throw new Error(`Unexpected error: ${(error as Error).message}`);
    }
  }
}

export default MongoConfig;
