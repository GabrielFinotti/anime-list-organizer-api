import { NotFoundError } from '../../../../src/application/errors/not-found.error';
import { ApplicationError } from '../../../../src/application/errors/application.error';

describe('NotFoundError', () => {
  it('should create an error with resource and identifier', () => {
    const error = new NotFoundError('User', '123');

    expect(error.message).toBe("User with identifier '123' not found");
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe('NotFoundError');
  });

  it('should create an error with only resource (no identifier)', () => {
    const error = new NotFoundError('User');

    expect(error.message).toBe('User not found');
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe('NotFoundError');
  });

  it('should extend ApplicationError', () => {
    const error = new NotFoundError('Anime', 'abc-123');

    expect(error).toBeInstanceOf(ApplicationError);
    expect(error).toBeInstanceOf(Error);
  });

  it('should have correct stack trace', () => {
    const error = new NotFoundError('Genre', 'genre-id');

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('NotFoundError');
  });

  it('should handle different resource types', () => {
    const userError = new NotFoundError('User', 'user-id');
    const animeError = new NotFoundError('Anime', 'anime-id');
    const categoryError = new NotFoundError('Category', 'category-id');
    const genreError = new NotFoundError('Genre', 'genre-id');

    expect(userError.message).toBe("User with identifier 'user-id' not found");
    expect(animeError.message).toBe("Anime with identifier 'anime-id' not found");
    expect(categoryError.message).toBe("Category with identifier 'category-id' not found");
    expect(genreError.message).toBe("Genre with identifier 'genre-id' not found");
  });

  it('should handle UUID identifiers', () => {
    const error = new NotFoundError('User', '550e8400-e29b-41d4-a716-446655440000');

    expect(error.message).toBe(
      "User with identifier '550e8400-e29b-41d4-a716-446655440000' not found",
    );
  });

  it('should handle empty string identifier', () => {
    const error = new NotFoundError('User', '');

    expect(error.message).toBe('User not found');
  });

  it('should handle resources without identifier gracefully', () => {
    const errorWithUndefined = new NotFoundError('Session', undefined);
    const errorWithoutArg = new NotFoundError('Token');

    expect(errorWithUndefined.message).toBe('Session not found');
    expect(errorWithoutArg.message).toBe('Token not found');
  });
});
