import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

export const connectDatabase = async (): Promise<void> => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
  }
};

export const clearDatabase = async (): Promise<void> => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};
