import Anime from '../../../../src/domain/entities/Anime.entity';
import Category from '../../../../src/domain/entities/Category.entity';
import Genre from '../../../../src/domain/entities/Genre.entity';
import User from '../../../../src/domain/entities/User.entity';
import Season from '../../../../src/domain/value-objects/season.value-object';
import UserPersistenceMapper, {
  UserDocument,
} from '../../../../src/infrastructure/mappers/user.persistence-mapper';

describe('UserPersistenceMapper', () => {
  const validUserId = '01KB3H4ZMD9J0NT3JQG8XTXWN0';
  const validAnimeId = '01KB3H4ZMD9J0NT3JQG8XTXWN1';
  const now = new Date();

  const createCategory = () => Category.create('Shonen', 'Anime for young boys');
  const createGenre = () => Genre.create('Action', 'Action packed adventures', false);

  const createAnime = (category: Category, genre: Genre) => {
    const season = Season.create({
      seasonNumber: 1,
      releaseDate: new Date(2023, 0, 1),
      totalEpisodes: 12,
    });

    return Anime.create({
      imageUrl: 'http://example.com/anime.jpg',
      name: 'Test Anime',
      synopsis: 'A great anime series',
      category,
      genres: [genre],
      animeType: 'serie',
      productionType: 'original',
      movies: [],
      seasons: [season],
      isAdultContent: false,
    });
  };

  describe('toPersistence', () => {
    it('should convert user without anime list to persistence document', async () => {
      const user = User.create({
        imageUrl: 'http://example.com/avatar.jpg',
        username: 'testuser',
        email: 'test@example.com',
        password: 'P@ssw0rd123',
        biography: 'This is a test biography for the user',
      });

      const document = UserPersistenceMapper.toPersistence(user);

      expect(document._id).toBe(user.id.value);
      expect(document.imageUrl).toBe('http://example.com/avatar.jpg');
      expect(document.username).toBe('testuser');
      expect(document.email).toBe('test@example.com');
      expect(document.password).toBe(user.password.value);
      expect(document.biography).toBe('This is a test biography for the user');
      expect(document.animeList.list).toHaveLength(0);
      expect(document.favoriteAnimes.list).toHaveLength(0);
      expect(document.role).toBe('user');
    });

    it('should convert user with anime in list to persistence document', async () => {
      const category = createCategory();
      const genre = createGenre();
      const anime = createAnime(category, genre);

      const user = User.create({
        imageUrl: 'http://example.com/avatar.jpg',
        username: 'animeuser',
        email: 'anime@example.com',
        password: 'P@ssw0rd123',
        biography: 'I love watching anime series',
      });

      user.addAnimeToAnimeList(anime);

      const document = UserPersistenceMapper.toPersistence(user);

      expect(document.animeList.list).toHaveLength(1);
      expect(document.animeList.list[0].anime).toBe(anime.id.value);
      expect(document.animeList.list[0].status).toBe('in_list');
      expect(document.animeList.list[0].isLiked).toBe(false);
    });

    it('should convert user with favorite animes to persistence document', async () => {
      const category = createCategory();
      const genre = createGenre();
      const anime = createAnime(category, genre);

      const user = User.create({
        imageUrl: 'http://example.com/avatar.jpg',
        username: 'favuser',
        email: 'fav@example.com',
        password: 'P@ssw0rd123',
        biography: 'I have many favorite animes',
      });

      user.addAnimeToAnimeList(anime);
      user.addAnimeToFavorites(anime);

      const document = UserPersistenceMapper.toPersistence(user);

      expect(document.favoriteAnimes.list).toHaveLength(1);
      expect(document.favoriteAnimes.list[0]).toBe(anime.id.value);
    });

    it('should handle admin role', async () => {
      const user = User.create({
        imageUrl: 'http://example.com/admin.jpg',
        username: 'adminuser',
        email: 'admin@example.com',
        password: 'Adm1n@Pass',
        biography: 'Administrator account for testing',
        role: 'admin',
      });

      const document = UserPersistenceMapper.toPersistence(user);

      expect(document.role).toBe('admin');
    });
  });

  describe('toDomain', () => {
    it('should convert persistence document to user without anime list', () => {
      const doc: UserDocument = {
        _id: validUserId,
        imageUrl: 'http://example.com/avatar.jpg',
        username: 'testuser',
        email: 'test@example.com',
        password: '$2b$10$hashedpasswordhere',
        biography: 'This is a test biography',
        animeList: {
          list: [],
          updatedAt: now,
        },
        favoriteAnimes: {
          list: [],
          updatedAt: now,
        },
        role: 'user',
        createdAt: now,
        updatedAt: now,
      };

      const animesMap = new Map<string, Anime>();
      const favoritesMap = new Map<string, Anime>();

      const user = UserPersistenceMapper.toDomain(doc, animesMap, favoritesMap);

      expect(user.id.value).toBe(validUserId);
      expect(user.username.value).toBe('testuser');
      expect(user.email.value).toBe('test@example.com');
      expect(user.biography?.value).toBe('This is a test biography');
      expect(user.animeList.list).toHaveLength(0);
      expect(user.favoriteAnimes.list).toHaveLength(0);
      expect(user.role).toBe('user');
    });

    it('should convert persistence document with anime list', () => {
      const category = createCategory();
      const genre = createGenre();
      const anime = createAnime(category, genre);

      const doc: UserDocument = {
        _id: validUserId,
        imageUrl: 'http://example.com/avatar.jpg',
        username: 'animeuser',
        email: 'anime@example.com',
        password: '$2b$10$hashedpasswordhere',
        biography: 'I love watching anime',
        animeList: {
          list: [
            {
              anime: anime.id.value,
              status: 'watching',
              moviesStatus: [],
              seasonsStatus: [
                {
                  season: {
                    seasonNumber: 1,
                    releaseDate: new Date(2023, 0, 1),
                    totalEpisodes: 12,
                  },
                  status: 'watching',
                  lastEpisodeWatched: 5,
                  isLiked: true,
                },
              ],
              isLiked: true,
            },
          ],
          updatedAt: now,
        },
        favoriteAnimes: {
          list: [],
          updatedAt: now,
        },
        role: 'user',
        createdAt: now,
        updatedAt: now,
      };

      const animesMap = new Map<string, Anime>();
      animesMap.set(anime.id.value, anime);
      const favoritesMap = new Map<string, Anime>();

      const user = UserPersistenceMapper.toDomain(doc, animesMap, favoritesMap);

      expect(user.animeList.list).toHaveLength(1);
      expect(user.animeList.list[0].anime.id.value).toBe(anime.id.value);
      expect(user.animeList.list[0].status).toBe('watching');
      expect(user.animeList.list[0].isLiked).toBe(true);
      expect(user.animeList.list[0].seasonsStatus).toHaveLength(1);
      expect(user.animeList.list[0].seasonsStatus[0].lastEpisodeWatched).toBe(5);
    });

    it('should convert persistence document with favorite animes', () => {
      const category = createCategory();
      const genre = createGenre();
      const anime = createAnime(category, genre);

      const doc: UserDocument = {
        _id: validUserId,
        imageUrl: 'http://example.com/avatar.jpg',
        username: 'favuser',
        email: 'fav@example.com',
        password: '$2b$10$hashedpasswordhere',
        biography: 'I have favorite animes',
        animeList: {
          list: [
            {
              anime: anime.id.value,
              status: 'finished',
              moviesStatus: [],
              seasonsStatus: [],
              isLiked: true,
            },
          ],
          updatedAt: now,
        },
        favoriteAnimes: {
          list: [anime.id.value],
          updatedAt: now,
        },
        role: 'user',
        createdAt: now,
        updatedAt: now,
      };

      const animesMap = new Map<string, Anime>();
      animesMap.set(anime.id.value, anime);
      const favoritesMap = new Map<string, Anime>();
      favoritesMap.set(anime.id.value, anime);

      const user = UserPersistenceMapper.toDomain(doc, animesMap, favoritesMap);

      expect(user.favoriteAnimes.list).toHaveLength(1);
      expect(user.favoriteAnimes.list[0].id.value).toBe(anime.id.value);
    });

    it('should throw error when anime not found in animesMap', () => {
      const doc: UserDocument = {
        _id: validUserId,
        imageUrl: 'http://example.com/avatar.jpg',
        username: 'testuser',
        email: 'test@example.com',
        password: '$2b$10$hashedpasswordhere',
        biography: 'Biography for testing',
        animeList: {
          list: [
            {
              anime: validAnimeId,
              status: 'watching',
              moviesStatus: [],
              seasonsStatus: [],
              isLiked: false,
            },
          ],
          updatedAt: now,
        },
        favoriteAnimes: {
          list: [],
          updatedAt: now,
        },
        role: 'user',
        createdAt: now,
        updatedAt: now,
      };

      const animesMap = new Map<string, Anime>();
      const favoritesMap = new Map<string, Anime>();

      expect(() => {
        UserPersistenceMapper.toDomain(doc, animesMap, favoritesMap);
      }).toThrow(`Anime not found: ${validAnimeId}`);
    });

    it('should handle admin role', () => {
      const doc: UserDocument = {
        _id: validUserId,
        imageUrl: 'http://example.com/admin.jpg',
        username: 'adminuser',
        email: 'admin@example.com',
        password: '$2b$10$hashedpasswordhere',
        biography: 'Administrator account',
        animeList: {
          list: [],
          updatedAt: now,
        },
        favoriteAnimes: {
          list: [],
          updatedAt: now,
        },
        role: 'admin',
        createdAt: now,
        updatedAt: now,
      };

      const animesMap = new Map<string, Anime>();
      const favoritesMap = new Map<string, Anime>();

      const user = UserPersistenceMapper.toDomain(doc, animesMap, favoritesMap);

      expect(user.role).toBe('admin');
    });
  });

  describe('round-trip conversion', () => {
    it('should preserve user data through toPersistence -> toDomain cycle', () => {
      const originalUser = User.create({
        imageUrl: 'http://example.com/round.jpg',
        username: 'roundtripuser',
        email: 'roundtrip@example.com',
        password: 'R0undTr1p@Pass',
        biography: 'Testing round trip conversion here',
      });

      const document = UserPersistenceMapper.toPersistence(originalUser);
      const reconstructedUser = UserPersistenceMapper.toDomain(
        document as UserDocument,
        new Map(),
        new Map(),
      );

      expect(reconstructedUser.id.value).toBe(originalUser.id.value);
      expect(reconstructedUser.username.value).toBe(originalUser.username.value);
      expect(reconstructedUser.email.value).toBe(originalUser.email.value);
      expect(reconstructedUser.biography?.value).toBe(originalUser.biography?.value);
    });

    it('should preserve user with anime list through round-trip', () => {
      const category = createCategory();
      const genre = createGenre();
      const anime = createAnime(category, genre);

      const originalUser = User.create({
        imageUrl: 'http://example.com/anime.jpg',
        username: 'animertuser',
        email: 'animert@example.com',
        password: 'An1m3@Pass!',
        biography: 'Testing anime list round trip',
      });

      originalUser.addAnimeToAnimeList(anime);

      const document = UserPersistenceMapper.toPersistence(originalUser);

      const animesMap = new Map<string, Anime>();
      animesMap.set(anime.id.value, anime);

      const reconstructedUser = UserPersistenceMapper.toDomain(
        document as UserDocument,
        animesMap,
        new Map(),
      );

      expect(reconstructedUser.animeList.list).toHaveLength(1);
      expect(reconstructedUser.animeList.list[0].anime.id.value).toBe(
        anime.id.value,
      );
    });
  });
});
