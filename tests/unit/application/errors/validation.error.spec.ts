import { ValidationError } from '../../../../src/application/errors/validation.error';
import { ApplicationError } from '../../../../src/application/errors/application.error';

describe('ValidationError', () => {
  it('should create an error with message only', () => {
    const error = new ValidationError('Invalid input');

    expect(error.message).toBe('Invalid input');
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe('ValidationError');
    expect(error.field).toBeUndefined();
  });

  it('should create an error with message and field', () => {
    const error = new ValidationError('Email is invalid', 'email');

    expect(error.message).toBe('Email is invalid');
    expect(error.statusCode).toBe(400);
    expect(error.field).toBe('email');
  });

  it('should extend ApplicationError', () => {
    const error = new ValidationError('Test validation error');

    expect(error).toBeInstanceOf(ApplicationError);
    expect(error).toBeInstanceOf(Error);
  });

  it('should have correct stack trace', () => {
    const error = new ValidationError('Stack trace test');

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('ValidationError');
  });

  it('should handle different field names', () => {
    const emailError = new ValidationError('Invalid email format', 'email');
    const passwordError = new ValidationError('Password too short', 'password');
    const usernameError = new ValidationError('Username already taken', 'username');
    const ageError = new ValidationError('Age must be positive', 'age');

    expect(emailError.field).toBe('email');
    expect(passwordError.field).toBe('password');
    expect(usernameError.field).toBe('username');
    expect(ageError.field).toBe('age');
  });

  it('should handle nested field names', () => {
    const error = new ValidationError('Invalid movie title', 'movies[0].title');

    expect(error.field).toBe('movies[0].title');
    expect(error.message).toBe('Invalid movie title');
  });

  it('should handle various validation messages', () => {
    const requiredError = new ValidationError('Field is required', 'name');
    const formatError = new ValidationError('Invalid format', 'email');
    const lengthError = new ValidationError('Must be at least 8 characters', 'password');
    const rangeError = new ValidationError('Value must be between 1 and 100', 'rating');

    expect(requiredError.message).toContain('required');
    expect(formatError.message).toContain('Invalid');
    expect(lengthError.message).toContain('8 characters');
    expect(rangeError.message).toContain('between');
  });

  it('should always have status code 400', () => {
    const error1 = new ValidationError('Error 1');
    const error2 = new ValidationError('Error 2', 'field');

    expect(error1.statusCode).toBe(400);
    expect(error2.statusCode).toBe(400);
  });
});
