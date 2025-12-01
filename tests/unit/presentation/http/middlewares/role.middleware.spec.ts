import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../../../../src/application/errors/unauthorized.error';

import roleMiddleware from '../../../../../src/presentation/http/middlewares/role.middleware';

describe('roleMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {};
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next when user has admin role', async () => {
    mockRequest.userRole = 'admin';

    await roleMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should call next with UnauthorizedError when user is not admin', async () => {
    mockRequest.userRole = 'user';

    await roleMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Admin role required to access this resource',
      }),
    );
  });

  it('should wrap unexpected errors into UnauthorizedError', async () => {
    // Define a getter that throws to simulate unexpected error during role access
    Object.defineProperty(mockRequest, 'userRole', {
      get: () => {
        throw new Error('unexpected');
      },
    });

    await roleMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Authorization failed',
      }),
    );
  });
});
