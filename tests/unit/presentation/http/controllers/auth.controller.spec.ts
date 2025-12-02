import { Request, Response, NextFunction } from 'express';
import { AuthController } from '../../../../../src/presentation/http/controllers/auth.controller';
import { LoginUseCase } from '../../../../../src/application/use-cases/auth/login.use-case';
import { LogoutUseCase } from '../../../../../src/application/use-cases/auth/logout.use-case';
import { LoginOutputDTO } from '../../../../../src/application/dtos/auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let mockLoginUseCase: jest.Mocked<LoginUseCase>;
  let mockLogoutUseCase: jest.Mocked<LogoutUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  const mockLoginOutput: LoginOutputDTO = {
    accessToken: 'jwt-token-123',
    user: {
      id: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      imageUrl: 'https://example.com/image.jpg',
      role: 'user',
    },
  };

  beforeEach(() => {
    mockLoginUseCase = {
      execute: jest.fn(),
    } as any;

    mockLogoutUseCase = {
      execute: jest.fn(),
    } as any;

    authController = new AuthController(mockLoginUseCase, mockLogoutUseCase);

    mockRequest = {
      body: {},
      headers: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully and return 200', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockLoginUseCase.execute.mockResolvedValue(mockLoginOutput);

      await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockLoginUseCase.execute).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockLoginOutput);
    });

    it('should call next with error when login fails', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const error = new Error('Invalid credentials');
      mockLoginUseCase.execute.mockRejectedValue(error);

      await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('logout', () => {
    it('should logout successfully and return 204 when token is provided', async () => {
      mockRequest.headers = { authorization: 'Bearer valid-token' };

      mockLogoutUseCase.execute.mockResolvedValue(undefined);

      await authController.logout(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockLogoutUseCase.execute).toHaveBeenCalledWith({ token: 'valid-token' });
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return 204 without calling logout use case when no token is provided', async () => {
      mockRequest.headers = {};

      await authController.logout(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockLogoutUseCase.execute).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return 204 when authorization header has no token', async () => {
      mockRequest.headers = { authorization: 'Bearer ' };

      await authController.logout(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockLogoutUseCase.execute).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should call next with error when logout fails', async () => {
      mockRequest.headers = { authorization: 'Bearer valid-token' };

      const error = new Error('Logout failed');
      mockLogoutUseCase.execute.mockRejectedValue(error);

      await authController.logout(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
