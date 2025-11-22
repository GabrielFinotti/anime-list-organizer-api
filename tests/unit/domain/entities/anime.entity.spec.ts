import Anime from '../../../../src/domain/entities/Anime.entity';
import Category from '../../../../src/domain/entities/Category.entity';
import Genre from '../../../../src/domain/entities/Genre.entity';
import Movie from '../../../../src/domain/value-objects/movie.value-object';
import Season from '../../../../src/domain/value-objects/season.value-object';
import Id from '../../../../src/domain/value-objects/id.value-object';

describe('Anime Entity', () => {
  describe('create', () => {
    it('should create a serie anime with valid data', () => {
      const category = Category.create('Action', 'Animes with action-packed scenes');
      const genre = Genre.create('Adventure', 'Long expeditions and quests', false);

      const season = Season.create({
        seasonNumber: 1,
        releaseDate: new Date(2020, 0, 1),
        totalEpisodes: 12,
      });

      const anime = Anime.create({
        imageUrl: 'http://example.com/image.png',
        name: 'My Serie',
        synopsis: 'This is a long synopsis that has more than 10 chars',
        category,
        genres: [genre],
        animeType: 'serie',
        productionType: 'original',
        movies: [],
        seasons: [season],
        isAdultContent: false,
      });

      expect(anime).toBeDefined();
      expect(anime.name).toBeDefined();
      expect(anime.genres.length).toBe(1);
      expect(anime.movies.length).toBe(0);
      expect(anime.seasons.length).toBe(1);
      expect(anime.totalSeasons).toBe(1);
      expect(anime.animeType).toBe('serie');
      expect(anime.productionType).toBe('original');
    });

    it('should create a movie anime with valid data', () => {
      const category = Category.create('Movie', 'Movie category');
      const genre = Genre.create('Drama', 'Emotional stories', true);

      const movie = Movie.create({ name: 'Film A', releaseDate: new Date(2021, 6, 20) });

      const anime = Anime.create({
        imageUrl: '  http://example.com/movie.png  ',
        name: '  Cool Movie  ',
        synopsis: 'Movie synopsis long enough',
        category,
        genres: [genre],
        animeType: 'movie',
        productionType: 'adaptation',
        movies: [movie],
        seasons: [],
        isAdultContent: true,
      });

      expect(anime.animeType).toBe('movie');
      expect(anime.movies.length).toBe(1);
      expect(anime.seasons.length).toBe(0);
      expect(anime.imageUrl.value).toBe('http://example.com/movie.png');
      expect(anime.name.value).toBe('cool movie');
    });

    it('should create a mixed anime with valid data', () => {
      const category = Category.create('Mixed', 'Mixed category');
      const genre = Genre.create('Fantasy', 'Magical and fantastical', false);

      const movie = Movie.create({ name: 'Movie X', releaseDate: new Date(2019, 1, 5) });
      const season = Season.create({
        seasonNumber: 1,
        releaseDate: new Date(2020, 7, 10),
        totalEpisodes: 8,
      });

      const anime = Anime.create({
        imageUrl: 'http://example.com/mixed.png',
        name: 'Mixed Title',
        synopsis: 'A proper synopsis for a mixed anime',
        category,
        genres: [genre],
        animeType: 'mixed',
        productionType: 'original',
        movies: [movie],
        seasons: [season],
        isAdultContent: false,
      });

      expect(anime.animeType).toBe('mixed');
      expect(anime.movies.length).toBe(1);
      expect(anime.seasons.length).toBe(1);
    });

    it('should throw when genres array is empty', () => {
      const category = Category.create('Mixed', 'Mixed category');

      expect(() =>
        Anime.create({
          imageUrl: 'http://example.com/mixed.png',
          name: 'Mixed Title',
          synopsis: 'A proper synopsis for a mixed anime',
          category,
          genres: [],
          animeType: 'mixed',
          productionType: 'original',
          movies: [],
          seasons: [],
          isAdultContent: false,
        }),
      ).toThrow('At least one genre must be provided');
    });

    it('should throw when animeType is invalid', () => {
      const category = Category.create('Mixed', 'Mixed category');
      const genre = Genre.create('Fantasy', 'Magical and fantastical', false);

      expect(() =>
        Anime.create({
          imageUrl: 'http://example.com/mixed.png',
          name: 'Mixed Title',
          synopsis: 'A proper synopsis for a mixed anime',
          category,
          genres: [genre],
          animeType: 'unknown',
          productionType: 'original',
          movies: [],
          seasons: [],
          isAdultContent: false,
        }),
      ).toThrow('Anime type must be one of the following: serie, movie, mixed');
    });

    it('should throw when productionType is invalid', () => {
      const category = Category.create('Mixed', 'Mixed category');
      const genre = Genre.create('Fantasy', 'Magical and fantastical', false);

      expect(() =>
        Anime.create({
          imageUrl: 'http://example.com/mixed.png',
          name: 'Mixed Title',
          synopsis: 'A proper synopsis for a mixed anime',
          category,
          genres: [genre],
          animeType: 'mixed',
          productionType: 'invalid',
          movies: [],
          seasons: [],
          isAdultContent: false,
        }),
      ).toThrow('Production type must be one of the following: original, adaptation');
    });

    it('should throw when synopsis is less than 10 chars', () => {
      const category = Category.create('Mixed', 'Mixed category');
      const genre = Genre.create('Fantasy', 'Magical and fantastical', false);

      expect(() =>
        Anime.create({
          imageUrl: 'http://example.com/mixed.png',
          name: 'Mixed Title',
          synopsis: 'short',
          category,
          genres: [genre],
          animeType: 'serie',
          productionType: 'original',
          movies: [],
          seasons: [
            Season.create({
              seasonNumber: 1,
              releaseDate: new Date(2020, 1, 1),
              totalEpisodes: 10,
            }),
          ],
          isAdultContent: false,
        }),
      ).toThrow('Description must be between 10 and 800 characters');
    });

    it('should throw on duplicate genres', () => {
      const category = Category.create('Mixed', 'Mixed category');
      const genre1 = Genre.create('Fantasy', 'Magical and fantastical', false);

      const genre2 = genre1; // same instance - duplicate

      expect(() =>
        Anime.create({
          imageUrl: 'http://example.com/mixed.png',
          name: 'Mixed Title',
          synopsis: 'A proper synopsis for a mixed anime',
          category,
          genres: [genre1, genre2],
          animeType: 'mixed',
          productionType: 'original',
          movies: [],
          seasons: [
            Season.create({
              seasonNumber: 1,
              releaseDate: new Date(2020, 1, 1),
              totalEpisodes: 10,
            }),
          ],
          isAdultContent: false,
        }),
      ).toThrow('Duplicate genres detected');
    });

    it('should throw for duplicate movies on create', () => {
      const category = Category.create('Mixed', 'Mixed category');
      const genre = Genre.create('Fantasy', 'Magical and fantastical', false);

      const movieDate = new Date(2022, 5, 20);
      const movie1 = Movie.create({ name: 'Movie A', releaseDate: movieDate });
      const movie2 = Movie.create({ name: 'Movie A', releaseDate: movieDate });

      expect(() =>
        Anime.create({
          imageUrl: 'http://example.com/movie.png',
          name: 'Bad Movie Anime',
          synopsis: 'A proper synopsis for a movie anime',
          category,
          genres: [genre],
          animeType: 'movie',
          productionType: 'original',
          movies: [movie1, movie2],
          seasons: [],
          isAdultContent: false,
        }),
      ).toThrow('Duplicate movies detected');
    });

    it('should throw for duplicate seasons on create', () => {
      const category = Category.create('Mixed', 'Mixed category');
      const genre = Genre.create('Fantasy', 'Magical and fantastical', false);

      const sDate = new Date(2021, 6, 1);
      const season1 = Season.create({ seasonNumber: 1, releaseDate: sDate, totalEpisodes: 10 });
      const season2 = Season.create({ seasonNumber: 1, releaseDate: sDate, totalEpisodes: 10 });

      expect(() =>
        Anime.create({
          imageUrl: 'http://example.com/serie.png',
          name: 'Dup Seasons',
          synopsis: 'A proper synopsis for a series',
          category,
          genres: [genre],
          animeType: 'serie',
          productionType: 'original',
          movies: [],
          seasons: [season1, season2],
          isAdultContent: false,
        }),
      ).toThrow('Duplicate seasons detected');
    });
  });

  describe('modifiers', () => {
    it('should add and remove genres', () => {
      const anime = Anime.create({
        imageUrl: 'http://example.com/mixed.png',
        name: 'Genre Test',
        synopsis: 'A long enough synopsis',
        category: Category.create('Misc', 'Misc description'),
        genres: [Genre.create('Alp', 'AAAAAAAAAA', false)],
        animeType: 'serie',
        productionType: 'original',
        movies: [],
        seasons: [
          Season.create({ seasonNumber: 1, releaseDate: new Date(2018, 1, 1), totalEpisodes: 8 }),
        ],
        isAdultContent: false,
      });

      const newGenre = Genre.create('Bet', 'BBBBBBBBBB', false);
      anime.addGenre(newGenre);

      expect(anime.genres.length).toBe(2);

      expect(() => anime.addGenre(newGenre)).toThrow('Duplicate genres detected');

      anime.removeGenre(newGenre.id);
      expect(anime.genres.length).toBe(1);

      expect(() => anime.removeGenre(newGenre.id)).toThrow('Genre not found');

      // cannot remove the last genre
      const remaining = anime.genres[0];
      expect(() => anime.removeGenre(remaining.id)).toThrow('Anime must have at least one genre');
    });

    it('should add and remove movies for non-serie anime', () => {
      const category = Category.create('Movies', 'Movie category description');
      const genre = Genre.create('Docu', 'Documentary style descriptions', false);

      const movie = Movie.create({ name: 'First', releaseDate: new Date(2020, 9, 1) });

      const anime = Anime.create({
        imageUrl: 'http://example.com/movie.png',
        name: 'Movie Test',
        synopsis: 'Long synopsis for a movie',
        category,
        genres: [genre],
        animeType: 'movie',
        productionType: 'adaptation',
        movies: [movie],
        seasons: [],
        isAdultContent: false,
      });

      // cannot add duplicate
      expect(() => anime.addMovie({ name: 'First', releaseDate: new Date(2020, 9, 1) })).toThrow(
        'Duplicate movies detected',
      );

      // adding a new movie works
      anime.addMovie({ name: 'Second', releaseDate: new Date(2021, 4, 5) });
      expect(anime.movies.length).toBe(2);

      // remove existing
      anime.removeMovie({ name: 'First', releaseDate: new Date(2020, 9, 1) });
      expect(anime.movies.length).toBe(1);

      // trying to remove last movie in a movie anime should throw
      expect(() =>
        anime.removeMovie({ name: 'Second', releaseDate: new Date(2021, 4, 5) }),
      ).toThrow('Anime must have at least one movie');

      // series cannot add movies
      const serie = Anime.create({
        imageUrl: 'http://example.com/serie.png',
        name: 'Serie Test',
        synopsis: 'Long synopsis for a series',
        category: Category.create('SeriesCat', 'SSSSSSSSSS'),
        genres: [Genre.create('Gam', 'GGGGGGGGGG', false)],
        animeType: 'serie',
        productionType: 'original',
        movies: [],
        seasons: [
          Season.create({ seasonNumber: 1, releaseDate: new Date(2019, 0, 1), totalEpisodes: 10 }),
        ],
        isAdultContent: false,
      });

      expect(() => serie.addMovie({ name: 'AddMovie', releaseDate: new Date() })).toThrow(
        'Series cannot have movies',
      );
    });

    it('should add and remove seasons for non-movie anime', () => {
      const category = Category.create('Series', 'Series description');
      const genre = Genre.create('Thrill', 'Thrilling experiences', false);

      const season = Season.create({
        seasonNumber: 1,
        releaseDate: new Date(2020, 3, 1),
        totalEpisodes: 10,
      });

      const anime = Anime.create({
        imageUrl: 'http://example.com/serie.png',
        name: 'Series Test',
        synopsis: 'Long synopsis for a series',
        category,
        genres: [genre],
        animeType: 'serie',
        productionType: 'original',
        movies: [],
        seasons: [season],
        isAdultContent: false,
      });

      // duplicate season cannot be added
      expect(() =>
        anime.addSeason({ seasonNumber: 1, releaseDate: new Date(2020, 3, 1), totalEpisodes: 10 }),
      ).toThrow('Duplicate seasons detected');

      // add a new season
      anime.addSeason({ seasonNumber: 2, releaseDate: new Date(2021, 3, 1), totalEpisodes: 10 });
      expect(anime.seasons.length).toBe(2);

      // remove a season
      anime.removeSeason({ seasonNumber: 1, releaseDate: new Date(2020, 3, 1), totalEpisodes: 10 });
      expect(anime.seasons.length).toBe(1);

      // removing last season in a serie should throw
      expect(() =>
        anime.removeSeason({
          seasonNumber: 2,
          releaseDate: new Date(2021, 3, 1),
          totalEpisodes: 10,
        }),
      ).toThrow('Anime must have at least one season');

      // movies cannot have seasons
      const movieAnime = Anime.create({
        imageUrl: 'http://example.com/movie.png',
        name: 'Movie Anime',
        synopsis: 'Long synopsis',
        category: Category.create('MoviesCat', 'MMMMMMMMMM'),
        genres: [Genre.create('Mix', 'MMMMMMMMMM', false)],
        animeType: 'movie',
        productionType: 'adaptation',
        movies: [Movie.create({ name: 'MovieX', releaseDate: new Date(2021, 3, 1) })],
        seasons: [],
        isAdultContent: false,
      });

      expect(() =>
        movieAnime.addSeason({ seasonNumber: 1, releaseDate: new Date(), totalEpisodes: 10 }),
      ).toThrow('Movies cannot have seasons');
    });
  });

  describe('update operations', () => {
    it('should update common info and image url', () => {
      const anime = Anime.create({
        imageUrl: 'http://example.com/img.png',
        name: 'Initial',
        synopsis: 'Initial long synopsis',
        category: Category.create('Initial', 'Initial category desc'),
        genres: [Genre.create('Gen', 'GENGENGENGEN', false)],
        animeType: 'serie',
        productionType: 'original',
        movies: [],
        seasons: [
          Season.create({ seasonNumber: 1, releaseDate: new Date(2019, 1, 1), totalEpisodes: 10 }),
        ],
        isAdultContent: false,
      });

      const before = anime.updatedAt;

      anime.updateCommonInfo({ name: 'Updated', synopsis: 'Updated long synopsis' });
      expect(anime.name.value).toBe('updated');
      expect(anime.synopsis.value).toBe('Updated long synopsis');
      expect(anime.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());

      expect(() => anime.updateCommonInfo({ synopsis: 123 as any })).toThrow(
        'Synopsis must be a string',
      );
      expect(() => anime.updateCommonInfo({ animeType: 123 as any })).toThrow(
        'Anime type must be a string',
      );

      anime.updateImageUrl('  https://example.com/new.png  ');
      expect(anime.imageUrl.value).toBe('https://example.com/new.png');

      expect(() => anime.updateImageUrl(123 as any)).toThrow('URL must be a non-empty string');
    });

    it('equals should compare properly', () => {
      const anime1 = Anime.create({
        imageUrl: 'http://example.com/img.png',
        name: 'Equal 1',
        synopsis: 'Long synopsis',
        category: Category.create('CatOne', 'CCCCCCCCCC'),
        genres: [Genre.create('Gen1', 'GGGGGGGGGG', false)],
        animeType: 'serie',
        productionType: 'original',
        movies: [],
        seasons: [
          Season.create({ seasonNumber: 1, releaseDate: new Date(2018, 1, 1), totalEpisodes: 10 }),
        ],
        isAdultContent: false,
      });

      const anime2 = Anime.create({
        imageUrl: 'http://example.com/img2.png',
        name: 'Equal 2',
        synopsis: 'Long synopsis',
        category: Category.create('CatTwo', 'CCCCCCCCCC'),
        genres: [Genre.create('Gen2', 'GGGGGGGGGG', false)],
        animeType: 'serie',
        productionType: 'original',
        movies: [],
        seasons: [
          Season.create({ seasonNumber: 1, releaseDate: new Date(2018, 1, 1), totalEpisodes: 10 }),
        ],
        isAdultContent: false,
      });

      // same id
      const sameId = anime2['id'];
      // hack set private _id to same value by constructing new Anime object with same id is not allowed
      // use reflection to set id for comparison (private but accessible via bracket)
      (anime1 as any)['_id'] = sameId;

      expect(anime1.equals(anime2)).toBe(true);

      // restore different id
      (anime1 as any)['_id'] = Id.generateRandomId();

      expect(anime1.equals(anime2)).toBe(false);
    });
  });
});
