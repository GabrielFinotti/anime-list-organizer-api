import Anime from '../../../../src/domain/entities/Anime.entity';
import Category from '../../../../src/domain/entities/Category.entity';
import Genre from '../../../../src/domain/entities/Genre.entity';
import Movie from '../../../../src/domain/value-objects/movie.value-object';
import Season from '../../../../src/domain/value-objects/season.value-object';
import AnimePersistenceMapper, {
  AnimeDocument,
} from '../../../../src/infrastructure/mappers/anime.persistence-mapper';

describe('AnimePersistenceMapper', () => {
  const validAnimeId = '01KB3H4ZMD9J0NT3JQG8XTXWN0';
  const validCategoryId = '01KB3H4ZMD9J0NT3JQG8XTXWN1';
  const validGenreId = '01KB3H4ZMD9J0NT3JQG8XTXWN2';
  const now = new Date();

  const createCategory = () => Category.create('Shonen', 'Anime for young boys');
  const createGenre = () => Genre.create('Action', 'Action packed adventures', false);

  describe('toPersistence', () => {
    it('should convert serie anime to persistence document', () => {
      const category = createCategory();
      const genre = createGenre();
      const season = Season.create({
        seasonNumber: 1,
        releaseDate: new Date(2023, 0, 1),
        totalEpisodes: 12,
      });

      const anime = Anime.create({
        imageUrl: 'http://example.com/image.jpg',
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

      const document = AnimePersistenceMapper.toPersistence(anime);

      expect(document._id).toBe(anime.id.value);
      expect(document.imageUrl).toBe('http://example.com/image.jpg');
      expect(document.name).toBe('test anime');
      expect(document.synopsis).toBe('A great anime series');
      expect(document.category).toBe(category.id.value);
      expect(document.genres).toHaveLength(1);
      expect(document.genres[0]).toBe(genre.id.value);
      expect(document.animeType).toBe('serie');
      expect(document.productionType).toBe('original');
      expect(document.seasons).toHaveLength(1);
      expect(document.seasons[0].seasonNumber).toBe(1);
      expect(document.movies).toHaveLength(0);
      expect(document.isAdultContent).toBe(false);
    });

    it('should convert movie anime to persistence document', () => {
      const category = createCategory();
      const genre = createGenre();
      const movie = Movie.create({
        name: 'The Movie',
        releaseDate: new Date(2023, 5, 15),
      });

      const anime = Anime.create({
        imageUrl: 'http://example.com/movie.jpg',
        name: 'Movie Anime',
        synopsis: 'An amazing anime movie',
        category,
        genres: [genre],
        animeType: 'movie',
        productionType: 'adaptation',
        movies: [movie],
        seasons: [],
        isAdultContent: false,
      });

      const document = AnimePersistenceMapper.toPersistence(anime);

      expect(document.animeType).toBe('movie');
      expect(document.productionType).toBe('adaptation');
      expect(document.movies).toHaveLength(1);
      expect(document.movies[0].title).toBe('the movie');
      expect(document.seasons).toHaveLength(0);
    });

    it('should convert mixed anime with movies and seasons', () => {
      const category = createCategory();
      const genre = createGenre();
      const movie = Movie.create({
        name: 'Special Movie',
        releaseDate: new Date(2023, 5, 15),
      });
      const season = Season.create({
        seasonNumber: 1,
        releaseDate: new Date(2022, 0, 1),
        totalEpisodes: 24,
      });

      const anime = Anime.create({
        imageUrl: 'http://example.com/mixed.jpg',
        name: 'Mixed Anime',
        synopsis: 'Anime with both movies and seasons',
        category,
        genres: [genre],
        animeType: 'mixed',
        productionType: 'original',
        movies: [movie],
        seasons: [season],
        isAdultContent: true,
      });

      const document = AnimePersistenceMapper.toPersistence(anime);

      expect(document.animeType).toBe('mixed');
      expect(document.movies).toHaveLength(1);
      expect(document.seasons).toHaveLength(1);
      expect(document.isAdultContent).toBe(true);
    });

    it('should handle multiple genres', () => {
      const category = createCategory();
      const genre1 = Genre.create('Action', 'Action adventures', false);
      const genre2 = Genre.create('Comedy', 'Funny moments here', false);
      const season = Season.create({
        seasonNumber: 1,
        releaseDate: new Date(2023, 0, 1),
        totalEpisodes: 12,
      });

      const anime = Anime.create({
        imageUrl: 'http://example.com/image.jpg',
        name: 'Multi Genre',
        synopsis: 'Anime with multiple genres',
        category,
        genres: [genre1, genre2],
        animeType: 'serie',
        productionType: 'original',
        movies: [],
        seasons: [season],
        isAdultContent: false,
      });

      const document = AnimePersistenceMapper.toPersistence(anime);

      expect(document.genres).toHaveLength(2);
      expect(document.genres).toContain(genre1.id.value);
      expect(document.genres).toContain(genre2.id.value);
    });
  });

  describe('toDomain', () => {
    it('should convert persistence document to serie anime', () => {
      const category = createCategory();
      const genre = createGenre();

      const doc: AnimeDocument = {
        _id: validAnimeId,
        imageUrl: 'http://example.com/image.jpg',
        name: 'test anime',
        synopsis: 'A great anime series',
        category: category.id.value,
        genres: [genre.id.value],
        animeType: 'serie',
        productionType: 'original',
        movies: [],
        seasons: [
          {
            seasonNumber: 1,
            releaseDate: new Date(2023, 0, 1),
            totalEpisodes: 12,
          },
        ],
        isAdultContent: false,
        createdAt: now,
        updatedAt: now,
      };

      const anime = AnimePersistenceMapper.toDomain(doc, category, [genre]);

      expect(anime.id.value).toBe(validAnimeId);
      expect(anime.name.value).toBe('test anime');
      expect(anime.synopsis.value).toBe('A great anime series');
      expect(anime.category.id.value).toBe(category.id.value);
      expect(anime.genres).toHaveLength(1);
      expect(anime.animeType).toBe('serie');
      expect(anime.seasons).toHaveLength(1);
      expect(anime.seasons[0].seasonNumber).toBe(1);
    });

    it('should convert persistence document to movie anime', () => {
      const category = createCategory();
      const genre = createGenre();

      const doc: AnimeDocument = {
        _id: validAnimeId,
        imageUrl: 'http://example.com/movie.jpg',
        name: 'movie anime',
        synopsis: 'An amazing anime movie',
        category: category.id.value,
        genres: [genre.id.value],
        animeType: 'movie',
        productionType: 'adaptation',
        movies: [
          {
            title: 'the movie',
            releaseDate: new Date(2023, 5, 15),
          },
        ],
        seasons: [],
        isAdultContent: false,
        createdAt: now,
        updatedAt: now,
      };

      const anime = AnimePersistenceMapper.toDomain(doc, category, [genre]);

      expect(anime.animeType).toBe('movie');
      expect(anime.movies).toHaveLength(1);
      expect(anime.movies[0].title.value).toBe('the movie');
    });

    it('should handle mixed anime with movies and seasons', () => {
      const category = createCategory();
      const genre = createGenre();

      const doc: AnimeDocument = {
        _id: validAnimeId,
        imageUrl: 'http://example.com/mixed.jpg',
        name: 'mixed anime',
        synopsis: 'Anime with movies and seasons',
        category: category.id.value,
        genres: [genre.id.value],
        animeType: 'mixed',
        productionType: 'original',
        movies: [
          {
            title: 'special movie',
            releaseDate: new Date(2023, 5, 15),
          },
        ],
        seasons: [
          {
            seasonNumber: 1,
            releaseDate: new Date(2022, 0, 1),
            totalEpisodes: 24,
          },
        ],
        isAdultContent: true,
        createdAt: now,
        updatedAt: now,
      };

      const anime = AnimePersistenceMapper.toDomain(doc, category, [genre]);

      expect(anime.animeType).toBe('mixed');
      expect(anime.movies).toHaveLength(1);
      expect(anime.seasons).toHaveLength(1);
      expect(anime.isAdultContent).toBe(true);
    });
  });

  describe('round-trip conversion', () => {
    it('should preserve data through toPersistence -> toDomain cycle', () => {
      const category = createCategory();
      const genre = createGenre();
      const season = Season.create({
        seasonNumber: 1,
        releaseDate: new Date(2023, 0, 1),
        totalEpisodes: 12,
      });

      const originalAnime = Anime.create({
        imageUrl: 'http://example.com/image.jpg',
        name: 'Round Trip Anime',
        synopsis: 'Testing round trip conversion',
        category,
        genres: [genre],
        animeType: 'serie',
        productionType: 'original',
        movies: [],
        seasons: [season],
        isAdultContent: false,
      });

      const document = AnimePersistenceMapper.toPersistence(originalAnime);
      const reconstructedAnime = AnimePersistenceMapper.toDomain(
        document as AnimeDocument,
        category,
        [genre],
      );

      expect(reconstructedAnime.id.value).toBe(originalAnime.id.value);
      expect(reconstructedAnime.name.value).toBe(originalAnime.name.value);
      expect(reconstructedAnime.synopsis.value).toBe(originalAnime.synopsis.value);
      expect(reconstructedAnime.animeType).toBe(originalAnime.animeType);
      expect(reconstructedAnime.seasons).toHaveLength(1);
    });

    it('should preserve movie data through round-trip', () => {
      const category = createCategory();
      const genre = createGenre();
      const movie = Movie.create({
        name: 'Test Movie',
        releaseDate: new Date(2023, 5, 15),
      });

      const originalAnime = Anime.create({
        imageUrl: 'http://example.com/movie.jpg',
        name: 'Movie Round Trip',
        synopsis: 'Testing movie round trip',
        category,
        genres: [genre],
        animeType: 'movie',
        productionType: 'adaptation',
        movies: [movie],
        seasons: [],
        isAdultContent: false,
      });

      const document = AnimePersistenceMapper.toPersistence(originalAnime);
      const reconstructedAnime = AnimePersistenceMapper.toDomain(
        document as AnimeDocument,
        category,
        [genre],
      );

      expect(reconstructedAnime.movies).toHaveLength(1);
      expect(reconstructedAnime.movies[0].title.value).toBe(originalAnime.movies[0].title.value);
    });
  });
});
