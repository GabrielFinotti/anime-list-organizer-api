import { ConflictError } from '../../../../src/application/errors/conflict.error';
import { ApplicationError } from '../../../../src/application/errors/application.error';

describe('ConflictError', () => {
  it('should create an error with correct message format', () => {
    const error = new ConflictError('User', 'email', 'test@example.com');

    expect(error.message).toBe("User with email 'test@example.com' already exists");
    expect(error.statusCode).toBe(409);
    expect(error.name).toBe('ConflictError');
  });

  it('should extend ApplicationError', () => {
    const error = new ConflictError('Anime', 'name', 'Naruto');

    expect(error).toBeInstanceOf(ApplicationError);
    expect(error).toBeInstanceOf(Error);
  });

  it('should have correct stack trace', () => {
    const error = new ConflictError('Genre', 'name', 'Action');

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('ConflictError');
  });

  it('should handle different resource types', () => {
    const userError = new ConflictError('User', 'email', 'user@test.com');
    const animeError = new ConflictError('Anime', 'name', 'One Piece');
    const categoryError = new ConflictError('Category', 'name', 'Shonen');
    const genreError = new ConflictError('Genre', 'name', 'Action');

    expect(userError.message).toBe("User with email 'user@test.com' already exists");
    expect(animeError.message).toBe("Anime with name 'One Piece' already exists");
    expect(categoryError.message).toBe("Category with name 'Shonen' already exists");
    expect(genreError.message).toBe("Genre with name 'Action' already exists");
  });

  it('should handle different field types', () => {
    const emailError = new ConflictError('User', 'email', 'test@test.com');
    const usernameError = new ConflictError('User', 'username', 'johndoe');
    const idError = new ConflictError('Anime', 'id', '123');

    expect(emailError.message).toContain('email');
    expect(usernameError.message).toContain('username');
    expect(idError.message).toContain('id');
  });

  it('should handle special characters in values', () => {
    const error = new ConflictError('User', 'email', "test'special@example.com");

    expect(error.message).toBe("User with email 'test'special@example.com' already exists");
    expect(error.statusCode).toBe(409);
  });
});
