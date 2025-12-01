import { LogoutUseCase } from '../../../../../src/application/use-cases/auth/logout.use-case';
import JwtService from '../../../../../src/infrastructure/services/jwt.service';
import TokenBlacklistService from '../../../../../src/infrastructure/services/tokenBlacklist.service';

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockTokenBlacklistService: jest.Mocked<TokenBlacklistService>;

  beforeEach(() => {
    mockJwtService = {
      generateToken: jest.fn(),
      verifyToken: jest.fn(),
      getTokenRemainingTTL: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    mockTokenBlacklistService = {
      addToBlacklist: jest.fn(),
      isBlacklisted: jest.fn(),
      removeFromBlacklist: jest.fn(),
    } as unknown as jest.Mocked<TokenBlacklistService>;

    useCase = new LogoutUseCase(mockJwtService, mockTokenBlacklistService);
  });

  describe('execute', () => {
    it('should add token to blacklist with remaining TTL', async () => {
      const input = { token: 'valid-token-123' };
      const remainingTTL = 3600;

      mockJwtService.getTokenRemainingTTL.mockReturnValue(remainingTTL);
      mockTokenBlacklistService.addToBlacklist.mockResolvedValue(undefined);

      await useCase.execute(input);

      expect(mockJwtService.getTokenRemainingTTL).toHaveBeenCalledWith(input.token);
      expect(mockTokenBlacklistService.addToBlacklist).toHaveBeenCalledWith(
        input.token,
        remainingTTL,
      );
    });

    it('should not add token to blacklist if TTL is 0 (already expired)', async () => {
      const input = { token: 'expired-token' };
      const remainingTTL = 0;

      mockJwtService.getTokenRemainingTTL.mockReturnValue(remainingTTL);

      await useCase.execute(input);

      expect(mockJwtService.getTokenRemainingTTL).toHaveBeenCalledWith(input.token);
      expect(mockTokenBlacklistService.addToBlacklist).not.toHaveBeenCalled();
    });

    it('should handle token with short remaining TTL', async () => {
      const input = { token: 'almost-expired-token' };
      const remainingTTL = 5; // 5 segundos restantes

      mockJwtService.getTokenRemainingTTL.mockReturnValue(remainingTTL);
      mockTokenBlacklistService.addToBlacklist.mockResolvedValue(undefined);

      await useCase.execute(input);

      expect(mockTokenBlacklistService.addToBlacklist).toHaveBeenCalledWith(input.token, 5);
    });

    it('should complete successfully without errors', async () => {
      const input = { token: 'valid-token' };

      mockJwtService.getTokenRemainingTTL.mockReturnValue(1800);
      mockTokenBlacklistService.addToBlacklist.mockResolvedValue(undefined);

      await expect(useCase.execute(input)).resolves.toBeUndefined();
    });
  });
});
