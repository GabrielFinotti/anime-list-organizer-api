import { Redis } from 'ioredis';

// Mock do StartEnv
const mockStartEnv = {
  getInstance: jest.fn().mockReturnValue({
    value: {
      REDIS_URL: 'redis://localhost:6379',
    },
  }),
};

jest.mock('../../../../src/infrastructure/env/startEnv.config', () => mockStartEnv);

// Mock do ioredis
const mockRedisClient = {
  status: 'wait',
  connect: jest.fn().mockResolvedValue(undefined),
  quit: jest.fn().mockResolvedValue(undefined),
  set: jest.fn().mockResolvedValue('OK'),
  setex: jest.fn().mockResolvedValue('OK'),
  get: jest.fn().mockResolvedValue(null),
  del: jest.fn().mockResolvedValue(1),
  exists: jest.fn().mockResolvedValue(0),
  ttl: jest.fn().mockResolvedValue(-1),
  keys: jest.fn().mockResolvedValue([]),
  on: jest.fn(),
};

jest.mock('ioredis', () => ({
  Redis: jest.fn().mockImplementation(() => mockRedisClient),
}));

import RedisClient from '../../../../src/infrastructure/cache/redis.client';

describe('RedisClient', () => {
  let redisClient: RedisClient;

  beforeEach(() => {
    jest.clearAllMocks();
    // Resetar o singleton para cada teste
    (RedisClient as any).instance = undefined;
    redisClient = RedisClient.getInstance();
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton)', () => {
      const instance1 = RedisClient.getInstance();
      const instance2 = RedisClient.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should create Redis client with correct configuration', () => {
      expect(Redis).toHaveBeenCalledWith(
        'redis://localhost:6379',
        expect.objectContaining({
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        }),
      );
    });

    it('should register event handlers', () => {
      expect(mockRedisClient.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(mockRedisClient.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockRedisClient.on).toHaveBeenCalledWith('close', expect.any(Function));
    });
  });

  describe('connect', () => {
    it('should connect to Redis when not already connected', async () => {
      mockRedisClient.status = 'wait';

      await redisClient.connect();

      expect(mockRedisClient.connect).toHaveBeenCalled();
    });

    it('should not connect if already connected', async () => {
      mockRedisClient.status = 'ready';

      await redisClient.connect();

      expect(mockRedisClient.connect).not.toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    it('should disconnect from Redis', async () => {
      await redisClient.disconnect();

      expect(mockRedisClient.quit).toHaveBeenCalled();
    });
  });

  describe('set', () => {
    it('should set a value without TTL', async () => {
      await redisClient.set('key', 'value');

      expect(mockRedisClient.set).toHaveBeenCalledWith('key', 'value');
    });

    it('should set a value with TTL', async () => {
      await redisClient.set('key', 'value', 3600);

      expect(mockRedisClient.setex).toHaveBeenCalledWith('key', 3600, 'value');
    });
  });

  describe('get', () => {
    it('should get a value from Redis', async () => {
      mockRedisClient.get.mockResolvedValueOnce('stored-value');

      const result = await redisClient.get('key');

      expect(mockRedisClient.get).toHaveBeenCalledWith('key');
      expect(result).toBe('stored-value');
    });

    it('should return null when key does not exist', async () => {
      mockRedisClient.get.mockResolvedValueOnce(null);

      const result = await redisClient.get('non-existent-key');

      expect(result).toBeNull();
    });
  });

  describe('del', () => {
    it('should delete a key from Redis', async () => {
      await redisClient.del('key');

      expect(mockRedisClient.del).toHaveBeenCalledWith('key');
    });
  });

  describe('exists', () => {
    it('should return true when key exists', async () => {
      mockRedisClient.exists.mockResolvedValueOnce(1);

      const result = await redisClient.exists('key');

      expect(mockRedisClient.exists).toHaveBeenCalledWith('key');
      expect(result).toBe(true);
    });

    it('should return false when key does not exist', async () => {
      mockRedisClient.exists.mockResolvedValueOnce(0);

      const result = await redisClient.exists('non-existent-key');

      expect(result).toBe(false);
    });
  });

  describe('ttl', () => {
    it('should return TTL for a key', async () => {
      mockRedisClient.ttl.mockResolvedValueOnce(3600);

      const result = await redisClient.ttl('key');

      expect(mockRedisClient.ttl).toHaveBeenCalledWith('key');
      expect(result).toBe(3600);
    });

    it('should return -1 when key has no expiration', async () => {
      mockRedisClient.ttl.mockResolvedValueOnce(-1);

      const result = await redisClient.ttl('key-without-ttl');

      expect(result).toBe(-1);
    });

    it('should return -2 when key does not exist', async () => {
      mockRedisClient.ttl.mockResolvedValueOnce(-2);

      const result = await redisClient.ttl('non-existent-key');

      expect(result).toBe(-2);
    });
  });

  describe('keys', () => {
    it('should return keys matching a pattern', async () => {
      mockRedisClient.keys.mockResolvedValueOnce(['key1', 'key2', 'key3']);

      const result = await redisClient.keys('key*');

      expect(mockRedisClient.keys).toHaveBeenCalledWith('key*');
      expect(result).toEqual(['key1', 'key2', 'key3']);
    });

    it('should return empty array when no keys match', async () => {
      mockRedisClient.keys.mockResolvedValueOnce([]);

      const result = await redisClient.keys('non-existent-*');

      expect(result).toEqual([]);
    });
  });

  describe('delByPattern', () => {
    it('should delete keys matching a pattern', async () => {
      mockRedisClient.keys.mockResolvedValueOnce(['user:1', 'user:2', 'user:3']);

      await redisClient.delByPattern('user:*');

      expect(mockRedisClient.keys).toHaveBeenCalledWith('user:*');
      expect(mockRedisClient.del).toHaveBeenCalledWith('user:1', 'user:2', 'user:3');
    });

    it('should not call del when no keys match the pattern', async () => {
      mockRedisClient.keys.mockResolvedValueOnce([]);
      mockRedisClient.del.mockClear();

      await redisClient.delByPattern('non-existent:*');

      expect(mockRedisClient.keys).toHaveBeenCalledWith('non-existent:*');
      expect(mockRedisClient.del).not.toHaveBeenCalled();
    });
  });

  describe('getClient', () => {
    it('should return the Redis client instance', () => {
      const client = redisClient.getClient();

      expect(client).toBe(mockRedisClient);
    });
  });

  describe('retry strategy', () => {
    it('should return correct delay for retries', () => {
      const redisConstructorCall = (Redis as unknown as jest.Mock).mock.calls[0];
      const options = redisConstructorCall[1];
      const retryStrategy = options.retryStrategy;

      expect(retryStrategy(1)).toBe(200);
      expect(retryStrategy(2)).toBe(400);
      expect(retryStrategy(3)).toBe(600);
    });

    it('should return null after max retries', () => {
      const redisConstructorCall = (Redis as unknown as jest.Mock).mock.calls[0];
      const options = redisConstructorCall[1];
      const retryStrategy = options.retryStrategy;

      expect(retryStrategy(4)).toBeNull();
      expect(retryStrategy(5)).toBeNull();
    });
  });
});
