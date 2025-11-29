import { Redis } from 'ioredis';
import StartEnv from '../env/startEnv.config.js';

class RedisClient {
  private readonly client: Redis;
  private static instance: RedisClient;

  private constructor() {
    const { REDIS_URL } = StartEnv.getInstance().value;

    this.client = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        if (times > 3) {
          console.error('Redis: Max retries reached. Giving up.');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    this.client.on('connect', () => {
      console.log('Redis: Connected successfully');
    });

    this.client.on('error', (error: Error) => {
      console.error('Redis: Connection error:', error.message);
    });

    this.client.on('close', () => {
      console.log('Redis: Connection closed');
    });
  }

  static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }

    return RedisClient.instance;
  }

  async connect(): Promise<void> {
    if (this.client.status === 'ready') {
      return;
    }

    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }

  async set(key: string, value: string, ttlInSeconds?: number): Promise<void> {
    if (ttlInSeconds) {
      await this.client.setex(key, ttlInSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);

    return result === 1;
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async delByPattern(pattern: string): Promise<void> {
    const keys = await this.keys(pattern);

    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  getClient(): Redis {
    return this.client;
  }
}

export default RedisClient;
