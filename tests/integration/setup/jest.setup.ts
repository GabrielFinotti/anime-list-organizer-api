// Setup global para testes de integração
// Este arquivo configura mocks e variáveis de ambiente antes de carregar a aplicação

// Configurar variáveis de ambiente para testes ANTES de qualquer import
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.MONGO_URI = 'mongodb://localhost:27017';
process.env.MONGO_NAME = 'test_db';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.SECRET_KEY = 'test-secret-key';
process.env.TOKEN_EXPIRATION = '1h';

// Mock do ioredis ANTES de qualquer import da aplicação
jest.mock('ioredis', () => {
  const RedisMock = require('ioredis-mock');
  return {
    Redis: RedisMock,
    default: RedisMock,
  };
});

import { connectDatabase, disconnectDatabase, clearDatabase } from './database.setup';
import Redis from 'ioredis-mock';

let redisMock: InstanceType<typeof Redis>;

beforeAll(async () => {
  await connectDatabase();
  redisMock = new Redis();
});

afterAll(async () => {
  await disconnectDatabase();
  if (redisMock) {
    await redisMock.quit();
  }
});

beforeEach(async () => {
  await clearDatabase();
  // Limpar Redis mock
  if (redisMock) {
    await redisMock.flushall();
  }
});
