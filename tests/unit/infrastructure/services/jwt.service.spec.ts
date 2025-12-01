import jwt from 'jsonwebtoken';

// Mock do StartEnv
const mockStartEnv = {
  getInstance: jest.fn().mockReturnValue({
    value: {
      SECRET_KEY: 'test-secret-key',
      TOKEN_EXPIRATION: '1h',
    },
  }),
};

jest.mock('../../../../src/infrastructure/env/startEnv.config', () => mockStartEnv);

import JwtService from '../../../../src/infrastructure/services/jwt.service';
import { TokenPayload } from '../../../../src/application/services/jwt.service.interface';

describe('JwtService', () => {
  let jwtService: JwtService;

  beforeEach(() => {
    // Resetar o singleton para cada teste
    (JwtService as any).instance = undefined;
    jwtService = JwtService.getInstance();
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton)', () => {
      const instance1 = JwtService.getInstance();
      const instance2 = JwtService.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload: TokenPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'user',
      };

      const token = jwtService.generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should include payload data in the token', () => {
      const payload: TokenPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'admin',
      };

      const token = jwtService.generateToken(payload);
      const decoded = jwt.decode(token) as TokenPayload & { iat: number; exp: number };

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });

    it('should include expiration time in the token', () => {
      const payload: TokenPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'user',
      };

      const token = jwtService.generateToken(payload);
      const decoded = jwt.decode(token) as { exp: number; iat: number };

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });

  describe('verifyToken', () => {
    it('should verify and return payload for valid token', () => {
      const payload: TokenPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'user',
      };

      const token = jwtService.generateToken(payload);
      const result = jwtService.verifyToken(token);

      expect(result.userId).toBe(payload.userId);
      expect(result.email).toBe(payload.email);
      expect(result.role).toBe(payload.role);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => jwtService.verifyToken(invalidToken)).toThrow('Invalid token');
    });

    it('should throw error for expired token', () => {
      const payload: TokenPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'user',
      };

      // Criar token expirado manualmente
      const expiredToken = jwt.sign(payload, 'test-secret-key', { expiresIn: '-1s' });

      expect(() => jwtService.verifyToken(expiredToken)).toThrow('Token expired');
    });

    it('should throw error for token with wrong secret', () => {
      const payload: TokenPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'user',
      };

      const tokenWithWrongSecret = jwt.sign(payload, 'wrong-secret');

      expect(() => jwtService.verifyToken(tokenWithWrongSecret)).toThrow('Invalid token');
    });
  });

  describe('getTokenRemainingTTL', () => {
    it('should return remaining TTL in seconds for valid token', () => {
      const payload: TokenPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'user',
      };

      const token = jwtService.generateToken(payload);
      const remainingTTL = jwtService.getTokenRemainingTTL(token);

      // Token expira em 1h = 3600 segundos, deve estar próximo disso
      expect(remainingTTL).toBeGreaterThan(3500);
      expect(remainingTTL).toBeLessThanOrEqual(3600);
    });

    it('should return 0 for expired token', () => {
      const payload: TokenPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'user',
      };

      const expiredToken = jwt.sign(payload, 'test-secret-key', { expiresIn: '-1s' });
      const remainingTTL = jwtService.getTokenRemainingTTL(expiredToken);

      expect(remainingTTL).toBe(0);
    });

    it('should return 0 for invalid token', () => {
      const remainingTTL = jwtService.getTokenRemainingTTL('invalid-token');

      expect(remainingTTL).toBe(0);
    });

    it('should return 0 for token without exp claim', () => {
      const tokenWithoutExp = jwt.sign({ data: 'test' }, 'test-secret-key', {
        noTimestamp: true,
      });
      const remainingTTL = jwtService.getTokenRemainingTTL(tokenWithoutExp);

      expect(remainingTTL).toBe(0);
    });
  });
});
