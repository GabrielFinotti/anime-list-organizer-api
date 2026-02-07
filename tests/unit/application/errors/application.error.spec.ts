import { ApplicationError } from '../../../../src/application/errors/application.error';

describe('ApplicationError', () => {
  it('should create an error with message and default status code', () => {
    const error = new ApplicationError('Something went wrong');

    expect(error.message).toBe('Something went wrong');
    expect(error.statusCode).toBe(500);
    expect(error.name).toBe('ApplicationError');
  });

  it('should create an error with custom message and status code', () => {
    const error = new ApplicationError('Custom error message', 400);

    expect(error.message).toBe('Custom error message');
    expect(error.statusCode).toBe(400);
  });

  it('should extend Error', () => {
    const error = new ApplicationError('Test error');

    expect(error).toBeInstanceOf(Error);
  });

  it('should have correct stack trace', () => {
    const error = new ApplicationError('Test error');

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('ApplicationError');
  });

  it('should preserve stack trace with captureStackTrace', () => {
    const error = new ApplicationError('Stack trace test');

    expect(error.stack).not.toContain('new ApplicationError');
  });

  it('should work with different HTTP status codes', () => {
    const badRequest = new ApplicationError('Bad Request', 400);
    const unauthorized = new ApplicationError('Unauthorized', 401);
    const forbidden = new ApplicationError('Forbidden', 403);
    const notFound = new ApplicationError('Not Found', 404);
    const internalError = new ApplicationError('Internal Server Error', 500);

    expect(badRequest.statusCode).toBe(400);
    expect(unauthorized.statusCode).toBe(401);
    expect(forbidden.statusCode).toBe(403);
    expect(notFound.statusCode).toBe(404);
    expect(internalError.statusCode).toBe(500);
  });
});
