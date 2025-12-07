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
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.VERSION = '0.0.0';
process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account-id';
process.env.CLOUDFLARE_ACCESS_KEY_ID = 'test-access-key';
process.env.CLOUDFLARE_SECRET_ACCESS_KEY = 'test-secret-key';
process.env.CLOUDFLARE_R2_BUCKET_NAME = 'test-bucket';
process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN = 'cdn.test.example.com';

// Mock do ioredis ANTES de qualquer import da aplicação
jest.mock('ioredis', () => {
  const RedisMock = require('ioredis-mock');
  return {
    Redis: RedisMock,
    default: RedisMock,
  };
});

// Mock do ImagesService para testes de integração
jest.mock('../../../src/infrastructure/services/images.service', () => {
  const mockInstance = {
    downloadImage: jest.fn().mockResolvedValue(Buffer.from('mock-image-data')),
  };

  class MockImagesService {
    private static instance: MockImagesService;

    static getInstance() {
      if (!MockImagesService.instance) {
        MockImagesService.instance = mockInstance as unknown as MockImagesService;
      }
      return MockImagesService.instance;
    }
  }

  return {
    __esModule: true,
    default: MockImagesService,
  };
});

// Mock do R2Service para testes de integração
jest.mock('../../../src/infrastructure/cloudflare/r2/service/r2.service', () => {
  const mockInstance = {
    uploadObject: jest.fn().mockResolvedValue(new URL('https://cdn.test.example.com/test-image.webp')),
    updateObject: jest.fn().mockResolvedValue(new URL('https://cdn.test.example.com/test-image.webp')),
    deleteObject: jest.fn().mockResolvedValue(undefined),
  };

  class MockR2Service {
    private static instance: MockR2Service;

    static getInstance() {
      if (!MockR2Service.instance) {
        MockR2Service.instance = mockInstance as unknown as MockR2Service;
      }
      return MockR2Service.instance;
    }
  }

  return {
    __esModule: true,
    default: MockR2Service,
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
