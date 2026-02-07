import Redis from 'ioredis-mock';

// Mock do ioredis para usar ioredis-mock
jest.mock('ioredis', () => require('ioredis-mock'));

// Instância compartilhada do Redis mock para os testes
let redisMock: InstanceType<typeof Redis>;

export const getRedisClient = (): InstanceType<typeof Redis> => {
  if (!redisMock) {
    redisMock = new Redis();
  }
  return redisMock;
};

export const clearRedis = async (): Promise<void> => {
  const redis = getRedisClient();
  await redis.flushall();
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisMock) {
    await redisMock.quit();
  }
};
