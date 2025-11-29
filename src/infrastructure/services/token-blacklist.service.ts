import RedisClient from '../cache/redis.client.js';

class TokenBlacklistService {
  private readonly redisClient: RedisClient;
  private readonly BLACKLIST_PREFIX = 'blacklist:';
  private static instance: TokenBlacklistService;

  private constructor() {
    this.redisClient = RedisClient.getInstance();
  }

  static getInstance(): TokenBlacklistService {
    if (!TokenBlacklistService.instance) {
      TokenBlacklistService.instance = new TokenBlacklistService();
    }

    return TokenBlacklistService.instance;
  }

  async addToBlacklist(token: string, remainingTTLInSeconds: number): Promise<void> {
    if (remainingTTLInSeconds <= 0) {
      return;
    }

    const key = this.getBlacklistKey(token);

    await this.redisClient.set(key, '1', remainingTTLInSeconds);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const key = this.getBlacklistKey(token);

    return this.redisClient.exists(key);
  }

  async removeFromBlacklist(token: string): Promise<void> {
    const key = this.getBlacklistKey(token);
    
    await this.redisClient.del(key);
  }

  private getBlacklistKey(token: string): string {
    return `${this.BLACKLIST_PREFIX}${token}`;
  }
}

export default TokenBlacklistService;
