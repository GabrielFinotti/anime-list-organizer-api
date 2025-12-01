import { Request, Response, NextFunction } from 'express';
import ApplicationError from '../../../../../src/application/errors/application.error';
import errorHandler from '../../../../../src/presentation/http/middlewares/errorHandler.middleware';

describe('errorHandler middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should respond with proper status and body when ApplicationError is thrown', () => {
    const appError = new ApplicationError('Not Found', 404);

    errorHandler(appError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: appError.name, message: appError.message });
  });

  it('should respond with InternalServerError when a generic Error is thrown', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const genericError = new Error('boom');

    errorHandler(genericError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Unexpected error:', genericError);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'InternalServerError', message: 'An unexpected error occurred' });

    consoleErrorSpy.mockRestore();
  });
});
