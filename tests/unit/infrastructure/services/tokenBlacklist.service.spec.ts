// Mock do RedisClient
const mockSet = jest.fn();
const mockGet = jest.fn();
const mockDel = jest.fn();
const mockExists = jest.fn();
const mockTtl = jest.fn();

jest.mock('../../../../src/infrastructure/cache/redis.client', () => {
  return {
    __esModule: true,
    default: {
      getInstance: () => ({
        set: mockSet,
        get: mockGet,
        del: mockDel,
        exists: mockExists,
        ttl: mockTtl,
      }),
    },
  };
});

import TokenBlacklistService from '../../../../src/infrastructure/services/tokenBlacklist.service';

describe('TokenBlacklistService', () => {
  let tokenBlacklistService: TokenBlacklistService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Resetar o singleton
    (TokenBlacklistService as any).instance = undefined;
    tokenBlacklistService = TokenBlacklistService.getInstance();
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton)', () => {
      const instance1 = TokenBlacklistService.getInstance();
      const instance2 = TokenBlacklistService.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('addToBlacklist', () => {
    it('should add token to blacklist with TTL', async () => {
      const token = 'valid-token-123';
      const remainingTTL = 3600;

      mockSet.mockResolvedValue(undefined);

      await tokenBlacklistService.addToBlacklist(token, remainingTTL);

      expect(mockSet).toHaveBeenCalledWith(`blacklist:${token}`, '1', remainingTTL);
    });

    it('should not add token to blacklist if TTL is 0', async () => {
      const token = 'expired-token';
      const remainingTTL = 0;

      await tokenBlacklistService.addToBlacklist(token, remainingTTL);

      expect(mockSet).not.toHaveBeenCalled();
    });

    it('should not add token to blacklist if TTL is negative', async () => {
      const token = 'expired-token';
      const remainingTTL = -100;

      await tokenBlacklistService.addToBlacklist(token, remainingTTL);

      expect(mockSet).not.toHaveBeenCalled();
    });
  });

  describe('isBlacklisted', () => {
    it('should return true if token is in blacklist', async () => {
      const token = 'blacklisted-token';

      mockExists.mockResolvedValue(true);

      const result = await tokenBlacklistService.isBlacklisted(token);

      expect(result).toBe(true);
      expect(mockExists).toHaveBeenCalledWith(`blacklist:${token}`);
    });

    it('should return false if token is not in blacklist', async () => {
      const token = 'valid-token';

      mockExists.mockResolvedValue(false);

      const result = await tokenBlacklistService.isBlacklisted(token);

      expect(result).toBe(false);
      expect(mockExists).toHaveBeenCalledWith(`blacklist:${token}`);
    });
  });

  describe('removeFromBlacklist', () => {
    it('should remove token from blacklist', async () => {
      const token = 'token-to-remove';

      mockDel.mockResolvedValue(undefined);

      await tokenBlacklistService.removeFromBlacklist(token);

      expect(mockDel).toHaveBeenCalledWith(`blacklist:${token}`);
    });
  });
});
