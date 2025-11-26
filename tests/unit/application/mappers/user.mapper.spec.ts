import User from '../../../../src/domain/entities/User.entity';
import Category from '../../../../src/domain/entities/Category.entity';
import Genre from '../../../../src/domain/entities/Genre.entity';
import Anime from '../../../../src/domain/entities/Anime.entity';
import Movie from '../../../../src/domain/value-objects/movie.value-object';
import Season from '../../../../src/domain/value-objects/season.value-object';
import UserMapper from '../../../../src/application/mappers/user.mapper';

describe('UserMapper', () => {
  it('toPersistence and toResponse should respect user structure', () => {
    const user = User.create({
      imageUrl: 'http://example.com/avatar.png',
      username: 'test',
      email: 'a@b.com',
      password: 'P@ssw0rd1',
      biography: 'Hello there, this bio is long enough',
    });

    const persistence = UserMapper.toPersistence(user as any);
    expect(persistence._id).toBe(user.id.value);
    expect(persistence.email).toBe(user.email.value);
    expect(persistence.password).toBe(user.password.value);

    const response = UserMapper.toResponse(user as any);
    expect(response.id).toBe(user.id.value);
    expect(response.email).toBe(user.email.value);
  });
});
