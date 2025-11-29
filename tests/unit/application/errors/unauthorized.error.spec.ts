import { UnauthorizedError } from '../../../../src/application/errors/unauthorized.error';
import { ApplicationError } from '../../../../src/application/errors/application.error';

describe('UnauthorizedError', () => {
  it('should create an error with default message', () => {
    const error = new UnauthorizedError();

    expect(error.message).toBe('Unauthorized');
    expect(error.statusCode).toBe(401);
    expect(error.name).toBe('UnauthorizedError');
  });

  it('should create an error with custom message', () => {
    const customMessage = 'Invalid credentials';
    const error = new UnauthorizedError(customMessage);

    expect(error.message).toBe(customMessage);
    expect(error.statusCode).toBe(401);
  });

  it('should extend ApplicationError', () => {
    const error = new UnauthorizedError();

    expect(error).toBeInstanceOf(ApplicationError);
    expect(error).toBeInstanceOf(Error);
  });

  it('should have correct stack trace', () => {
    const error = new UnauthorizedError('Test error');

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('UnauthorizedError');
  });
});
