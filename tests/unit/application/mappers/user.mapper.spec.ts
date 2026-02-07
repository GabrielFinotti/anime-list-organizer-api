import User from '../../../../src/domain/entities/User.entity';
import UserMapper from '../../../../src/application/mappers/user.mapper';

describe('UserMapper', () => {
  it('toResponse should map domain to DTO correctly', () => {
    const user = User.create({
      imageUrl: 'http://example.com/avatar.png',
      username: 'test',
      email: 'a@b.com',
      password: 'P@ssw0rd1',
      biography: 'Hello there, this bio is long enough',
    });

    const response = UserMapper.toResponse(user as any);

    expect(response.id).toBe(user.id.value);
    expect(response.email).toBe(user.email.value);
    expect(response.username).toBe(user.username.value);
    expect(response.biography).toBe(user.biography?.value);
    expect(response.imageUrl).toBe(user.imageUrl?.value);
    expect(response.animeList.list).toEqual([]);
    expect(response.favoriteAnimes).toEqual([]);
  });
});
