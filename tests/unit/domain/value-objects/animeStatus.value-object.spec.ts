import Anime from '../../../../src/domain/entities/Anime.entity';
import Category from '../../../../src/domain/entities/Category.entity';
import Genre from '../../../../src/domain/entities/Genre.entity';
import Movie from '../../../../src/domain/value-objects/movie.value-object';
import Season from '../../../../src/domain/value-objects/season.value-object';
import MovieStatus from '../../../../src/domain/value-objects/movieStatus.value-object';
import SeasonStatus from '../../../../src/domain/value-objects/seasonStatus.value-object';
import AnimeStatus from '../../../../src/domain/value-objects/animeStatus';

describe('AnimeStatus Value Object', () => {
  describe('create', () => {
    it('should create an AnimeStatus with valid data', () => {
      const category = Category.create('Action', 'Action', 'Young Adults', 'Action animes');
      const genre = Genre.create('Adventure', 'Adventures', false);

      const movie = Movie.create({ name: 'Movie 1', releaseDate: new Date(2020, 0, 1) });
      const season = Season.create({
        seasonNumber: 1,
        releaseDate: new Date(2020, 0, 1),
        totalEpisodes: 12,
      });

      const anime = Anime.create({
        imageUrl: 'http://example.com/image.png',
        name: 'My Anime',
        synopsis: 'This is a long synopsis that has more than 10 chars',
        category,
        genres: [genre],
        animeType: 'mixed',
        productionType: 'original',
        typeOfMaterialOrigin: 'none',
        movies: [movie],
        seasons: [season],
        isAdultContent: false,
      });

      const ms = MovieStatus.create({ movie: movie, status: 'watching', isLiked: true });
      const ss = SeasonStatus.create({
        season,
        status: 'watching',
        lastEpisodeWatched: 1,
        isLiked: true,
      });

      const as = AnimeStatus.create({
        anime,
        status: 'watching',
        moviesStatus: [ms],
        seasonsStatus: [ss],
        isLiked: true,
      });

      expect(as.anime).toBeInstanceOf(Anime);
      expect(as.status).toBe('watching');
      expect(as.moviesStatus.length).toBe(1);
      expect(as.seasonsStatus.length).toBe(1);
      expect(as.isLiked).toBe(true);
    });

    it('should throw when status is invalid', () => {
      const category = Category.create('Action', 'Action', 'Young Adults', 'Action animes');
      const genre = Genre.create('Adventure', 'Adventures', false);

      const anime = Anime.create({
        imageUrl: 'http://example.com/image.png',
        name: 'My Anime',
        synopsis: 'A long synopsis for anime',
        category,
        genres: [genre],
        animeType: 'serie',
        productionType: 'original',
        typeOfMaterialOrigin: 'none',
        movies: [],
        seasons: [
          Season.create({ seasonNumber: 1, releaseDate: new Date(2020, 0, 1), totalEpisodes: 5 }),
        ],
        isAdultContent: false,
      });

      expect(() =>
        AnimeStatus.create({
          anime,
          status: 'unknown' as any,
          moviesStatus: [],
          seasonsStatus: [],
          isLiked: false,
        }),
      ).toThrow('status: must be one of watching, finished, dropped, in_list');
    });

    it('should throw when isLiked is invalid', () => {
      const category = Category.create(
        'Action',
        'Action',
        'Young Adults',
        'Category for action animes',
      );
      const genre = Genre.create('Adventure', 'Genre description for testing', false);

      const anime = Anime.create({
        imageUrl: 'http://example.com',
        name: 'Test',
        synopsis: 'A proper synopsis',
        category,
        genres: [genre],
        animeType: 'serie',
        productionType: 'original',
        typeOfMaterialOrigin: 'none',
        movies: [],
        seasons: [
          Season.create({ seasonNumber: 1, releaseDate: new Date(2019, 0, 1), totalEpisodes: 4 }),
        ],
        isAdultContent: false,
      });

      expect(() =>
        AnimeStatus.create({
          anime,
          status: 'watching',
          moviesStatus: [],
          seasonsStatus: [],
          isLiked: 'nope' as any,
        }),
      ).toThrow('isLiked: must be a boolean');
    });

    it('equals should compare properly', () => {
      const category = Category.create('CatC', 'CatC', 'Young Adults', 'Category description');
      const genre = Genre.create('Gaku', 'Genre description for equals test', false);

      const movie = Movie.create({ name: 'Same', releaseDate: new Date(2021, 2, 2) });
      const season = Season.create({
        seasonNumber: 1,
        releaseDate: new Date(2020, 2, 2),
        totalEpisodes: 5,
      });

      const anime1 = Anime.create({
        imageUrl: 'http://example.com/a.png',
        name: 'Anime1',
        synopsis: 'Long enough synopsis',
        category,
        genres: [genre],
        animeType: 'mixed',
        productionType: 'original',
        typeOfMaterialOrigin: 'none',
        movies: [movie],
        seasons: [season],
        isAdultContent: false,
      });

      const anime2 = Anime.create({
        imageUrl: 'http://example.com/b.png',
        name: 'Anime2',
        synopsis: 'Long enough synopsis',
        category: Category.create(
          'Other',
          'Other',
          'Young Adults',
          'Other category with long description',
        ),
        genres: [Genre.create('GXZ', 'Other genre long description', false)],
        animeType: 'mixed',
        productionType: 'original',
        typeOfMaterialOrigin: 'none',
        movies: [movie],
        seasons: [season],
        isAdultContent: false,
      });

      // use same anime id to simulate same anime in both objects
      (anime2 as any)['_id'] = anime1['id'];

      const ms1 = MovieStatus.create({ movie: movie, status: 'watching', isLiked: true });
      const ss1 = SeasonStatus.create({
        season,
        status: 'finished',
        lastEpisodeWatched: 5,
        isLiked: false,
      });

      const ms2 = MovieStatus.create({ movie: movie, status: 'watching', isLiked: true });
      const ss2 = SeasonStatus.create({
        season,
        status: 'finished',
        lastEpisodeWatched: 5,
        isLiked: false,
      });

      const a1 = AnimeStatus.create({
        anime: anime1,
        status: 'watching',
        moviesStatus: [ms1],
        seasonsStatus: [ss1],
        isLiked: true,
      });
      const a2 = AnimeStatus.create({
        anime: anime2,
        status: 'watching',
        moviesStatus: [ms2],
        seasonsStatus: [ss2],
        isLiked: true,
      });
      const a3 = AnimeStatus.create({
        anime: anime1,
        status: 'finished',
        moviesStatus: [ms2],
        seasonsStatus: [ss2],
        isLiked: true,
      });

      expect(a1.equals(a2)).toBe(true);
      expect(a1.equals(a3)).toBe(false);
    });
  });
});
