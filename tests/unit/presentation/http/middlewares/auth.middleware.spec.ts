import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../../../../src/application/errors/unauthorized.error';

// Mock dos services - declarar fora para jest poder hoistear
const mockVerifyToken = jest.fn();
const mockIsBlacklisted = jest.fn();

jest.mock('../../../../../src/infrastructure/services/jwt.service', () => {
  return {
    __esModule: true,
    default: {
      getInstance: () => ({
        verifyToken: mockVerifyToken,
        generateToken: jest.fn(),
        getTokenRemainingTTL: jest.fn(),
      }),
    },
  };
});

jest.mock('../../../../../src/infrastructure/services/token-blacklist.service', () => {
  return {
    __esModule: true,
    default: {
      getInstance: () => ({
        isBlacklisted: mockIsBlacklisted,
        addToBlacklist: jest.fn(),
        removeFromBlacklist: jest.fn(),
      }),
    },
  };
});

import { authMiddleware } from '../../../../../src/presentation/http/middlewares/auth.middleware';

describe('authMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('Authorization header validation', () => {
    it('should call next with UnauthorizedError when authorization header is missing', async () => {
      mockRequest.headers = {};

      await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Authorization header is required',
        }),
      );
    });

    it('should call next with UnauthorizedError when authorization format is invalid', async () => {
      mockRequest.headers = { authorization: 'InvalidFormat token123' };

      await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid authorization format. Use: Bearer <token>',
        }),
      );
    });

    it('should call next with UnauthorizedError when token is missing after Bearer', async () => {
      mockRequest.headers = { authorization: 'Bearer ' };

      await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('Token blacklist validation', () => {
    it('should call next with UnauthorizedError when token is blacklisted', async () => {
      mockRequest.headers = { authorization: 'Bearer blacklisted-token' };
      mockIsBlacklisted.mockResolvedValue(true);

      await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockIsBlacklisted).toHaveBeenCalledWith('blacklisted-token');
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Token has been revoked',
        }),
      );
    });
  });

  describe('Token verification', () => {
    it('should call next with UnauthorizedError when token is invalid', async () => {
      mockRequest.headers = { authorization: 'Bearer invalid-token' };
      mockIsBlacklisted.mockResolvedValue(false);
      mockVerifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid token',
        }),
      );
    });

    it('should call next with UnauthorizedError when token is expired', async () => {
      mockRequest.headers = { authorization: 'Bearer expired-token' };
      mockIsBlacklisted.mockResolvedValue(false);
      mockVerifyToken.mockImplementation(() => {
        throw new Error('Token expired');
      });

      await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Token expired',
        }),
      );
    });
  });

  describe('Successful authentication', () => {
    it('should set userId and userRole on request and call next for valid token', async () => {
      const validPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'user' as const,
      };

      mockRequest.headers = { authorization: 'Bearer valid-token' };
      mockIsBlacklisted.mockResolvedValue(false);
      mockVerifyToken.mockReturnValue(validPayload);

      await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.userId).toBe('user-123');
      expect(mockRequest.userRole).toBe('user');
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should correctly handle admin role', async () => {
      const adminPayload = {
        userId: 'admin-123',
        email: 'admin@example.com',
        role: 'admin' as const,
      };

      mockRequest.headers = { authorization: 'Bearer admin-token' };
      mockIsBlacklisted.mockResolvedValue(false);
      mockVerifyToken.mockReturnValue(adminPayload);

      await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.userId).toBe('admin-123');
      expect(mockRequest.userRole).toBe('admin');
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('Error handling', () => {
    it('should pass through UnauthorizedError directly', async () => {
      mockRequest.headers = { authorization: 'Bearer test-token' };
      mockIsBlacklisted.mockResolvedValue(false);

      const unauthorizedError = new UnauthorizedError('Custom unauthorized message');
      mockVerifyToken.mockImplementation(() => {
        throw unauthorizedError;
      });

      await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(unauthorizedError);
    });

    it('should wrap generic errors in UnauthorizedError', async () => {
      mockRequest.headers = { authorization: 'Bearer test-token' };
      mockIsBlacklisted.mockResolvedValue(false);
      mockVerifyToken.mockImplementation(() => {
        throw new Error('Some generic error');
      });

      await authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Some generic error',
        }),
      );
    });
  });
});
