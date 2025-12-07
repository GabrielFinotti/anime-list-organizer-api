import Anime from '../../../../src/domain/entities/Anime.entity';
import Category from '../../../../src/domain/entities/Category.entity';
import Genre from '../../../../src/domain/entities/Genre.entity';
import Movie from '../../../../src/domain/value-objects/movie.value-object';
import Season from '../../../../src/domain/value-objects/season.value-object';
import Id from '../../../../src/domain/value-objects/id.value-object';

describe('Anime Entity', () => {
  describe('create', () => {
    it('should create a serie anime with valid data', () => {
      const category = Category.create(
        'Action',
        'Ação',
        'General',
        'Animes with action-packed scenes',
      );
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
        typeOfMaterialOrigin: 'none',
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
      expect(anime.typeOfMaterialOrigin).toBe('none');
    });

    it('should create a movie anime with valid data', () => {
      const category = Category.create('Movie', 'Filme', 'General', 'Movie category');
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
        typeOfMaterialOrigin: 'manga',
        movies: [movie],
        seasons: [],
        isAdultContent: true,
      });

      expect(anime.animeType).toBe('movie');
      expect(anime.movies.length).toBe(1);
      expect(anime.seasons.length).toBe(0);
      expect(anime.imageUrl.value).toBe('http://example.com/movie.png');
      expect(anime.name.value).toBe('cool movie');
      expect(anime.typeOfMaterialOrigin).toBe('manga');
    });

    it('should create a mixed anime with valid data', () => {
      const category = Category.create('Mixed', 'Misto', 'General', 'Mixed category');
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
        typeOfMaterialOrigin: 'none',
        movies: [movie],
        seasons: [season],
        isAdultContent: false,
      });

      expect(anime.animeType).toBe('mixed');
      expect(anime.movies.length).toBe(1);
      expect(anime.seasons.length).toBe(1);
      expect(anime.typeOfMaterialOrigin).toBe('none');
    });

    it('should throw when genres array is empty', () => {
      const category = Category.create('Mixed', 'Misto', 'General', 'Mixed category');

      expect(() =>
        Anime.create({
          imageUrl: 'http://example.com/mixed.png',
          name: 'Mixed Title',
          synopsis: 'A proper synopsis for a mixed anime',
          category,
          genres: [],
          animeType: 'mixed',
          productionType: 'original',
          typeOfMaterialOrigin: 'none',
          movies: [],
          seasons: [],
          isAdultContent: false,
        }),
      ).toThrow('genres: at least one genre must be provided');
    });

    it('should throw when animeType is invalid', () => {
      const category = Category.create('Mixed', 'Misto', 'General', 'Mixed category');
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
          typeOfMaterialOrigin: 'none',
          movies: [],
          seasons: [],
          isAdultContent: false,
        }),
      ).toThrow('animeType: must be one of serie, movie, mixed');
    });

    it('should throw when productionType is invalid', () => {
      const category = Category.create('Mixed', 'Misto', 'General', 'Mixed category');
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
          typeOfMaterialOrigin: 'none',
          movies: [],
          seasons: [],
          isAdultContent: false,
        }),
      ).toThrow('productionType: must be one of original, adaptation');
    });

    it('should throw when synopsis is less than 10 chars', () => {
      const category = Category.create('Mixed', 'Misto', 'General', 'Mixed category');
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
          typeOfMaterialOrigin: 'none',
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
      ).toThrow('description: must be between 10 and 800 characters');
    });

    it('should throw on duplicate genres', () => {
      const category = Category.create('Mixed', 'Misto', 'General', 'Mixed category');
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
          typeOfMaterialOrigin: 'none',
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
      ).toThrow('genres: duplicate items detected');
    });

    it('should throw for duplicate movies on create', () => {
      const category = Category.create('Mixed', 'Misto', 'General', 'Mixed category');
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
          typeOfMaterialOrigin: 'none',
          movies: [movie1, movie2],
          seasons: [],
          isAdultContent: false,
        }),
      ).toThrow('movies: duplicate items detected');
    });

    it('should throw for duplicate seasons on create', () => {
      const category = Category.create('Mixed', 'Misto', 'General', 'Mixed category');
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
          typeOfMaterialOrigin: 'none',
          movies: [],
          seasons: [season1, season2],
          isAdultContent: false,
        }),
      ).toThrow('seasons: duplicate items detected');
    });

    it('should throw when typeOfMaterialOrigin is invalid', () => {
      const category = Category.create('Mixed', 'Misto', 'General', 'Mixed category');
      const genre = Genre.create('Fantasy', 'Magical and fantastical', false);

      expect(() =>
        Anime.create({
          imageUrl: 'http://example.com/mixed.png',
          name: 'Mixed Title',
          synopsis: 'A proper synopsis for a mixed anime',
          category,
          genres: [genre],
          animeType: 'serie',
          productionType: 'original',
          typeOfMaterialOrigin: 'invalid',
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
      ).toThrow(
        'typeOfMaterialOrigin: must be one of manga, light_novel, visual_novel, game, other, none',
      );
    });

    it('should throw when adaptation has typeOfMaterialOrigin as none', () => {
      const category = Category.create('Mixed', 'Misto', 'General', 'Mixed category');
      const genre = Genre.create('Fantasy', 'Magical and fantastical', false);

      expect(() =>
        Anime.create({
          imageUrl: 'http://example.com/mixed.png',
          name: 'Mixed Title',
          synopsis: 'A proper synopsis for a mixed anime',
          category,
          genres: [genre],
          animeType: 'movie',
          productionType: 'adaptation',
          typeOfMaterialOrigin: 'none',
          movies: [Movie.create({ name: 'Movie A', releaseDate: new Date(2021, 6, 20) })],
          seasons: [],
          isAdultContent: false,
        }),
      ).toThrow("typeOfMaterialOrigin: adaptations cannot have 'none' as type of material origin");
    });
  });

  describe('modifiers', () => {
    it('should add and remove genres', () => {
      const anime = Anime.create({
        imageUrl: 'http://example.com/mixed.png',
        name: 'Genre Test',
        synopsis: 'A long enough synopsis',
        category: Category.create('Misc', 'Misc', 'General', 'Misc description'),
        genres: [Genre.create('Alp', 'AAAAAAAAAA', false)],
        animeType: 'serie',
        productionType: 'original',
        typeOfMaterialOrigin: 'none',
        movies: [],
        seasons: [
          Season.create({ seasonNumber: 1, releaseDate: new Date(2018, 1, 1), totalEpisodes: 8 }),
        ],
        isAdultContent: false,
      });

      const newGenre = Genre.create('Bet', 'BBBBBBBBBB', false);
      anime.addGenre(newGenre);

      expect(anime.genres.length).toBe(2);

      expect(() => anime.addGenre(newGenre)).toThrow('genres: duplicate items detected');

      anime.removeGenre(newGenre.id);
      expect(anime.genres.length).toBe(1);

      expect(() => anime.removeGenre(newGenre.id)).toThrow('genre: not found');

      // cannot remove the last genre
      const remaining = anime.genres[0];
      expect(() => anime.removeGenre(remaining.id)).toThrow(
        'genres: anime must have at least one genre',
      );
    });

    it('should add and remove movies for non-serie anime', () => {
      const category = Category.create('Movies', 'Filmes', 'General', 'Movie category description');
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
        typeOfMaterialOrigin: 'manga',
        movies: [movie],
        seasons: [],
        isAdultContent: false,
      });

      // cannot add duplicate
      expect(() => anime.addMovie({ name: 'First', releaseDate: new Date(2020, 9, 1) })).toThrow(
        'movies: duplicate items detected',
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
      ).toThrow('movies: anime must have at least one movie');

      // series cannot add movies
      const serie = Anime.create({
        imageUrl: 'http://example.com/serie.png',
        name: 'Serie Test',
        synopsis: 'Long synopsis for a series',
        category: Category.create('SeriesCat', 'Series', 'General', 'SSSSSSSSSS'),
        genres: [Genre.create('Gam', 'GGGGGGGGGG', false)],
        animeType: 'serie',
        productionType: 'original',
        typeOfMaterialOrigin: 'none',
        movies: [],
        seasons: [
          Season.create({ seasonNumber: 1, releaseDate: new Date(2019, 0, 1), totalEpisodes: 10 }),
        ],
        isAdultContent: false,
      });

      expect(() => serie.addMovie({ name: 'AddMovie', releaseDate: new Date() })).toThrow(
        'movies: series cannot have movies',
      );
    });

    it('should add and remove seasons for non-movie anime', () => {
      const category = Category.create('Series', 'Series', 'General', 'Series description');
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
        typeOfMaterialOrigin: 'none',
        movies: [],
        seasons: [season],
        isAdultContent: false,
      });

      // duplicate season cannot be added
      expect(() =>
        anime.addSeason({ seasonNumber: 1, releaseDate: new Date(2020, 3, 1), totalEpisodes: 10 }),
      ).toThrow('seasons: duplicate items detected');

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
      ).toThrow('seasons: anime must have at least one season');

      // movies cannot have seasons
      const movieAnime = Anime.create({
        imageUrl: 'http://example.com/movie.png',
        name: 'Movie Anime',
        synopsis: 'Long synopsis',
        category: Category.create('MoviesCat', 'Filmes', 'General', 'MMMMMMMMMM'),
        genres: [Genre.create('Mix', 'MMMMMMMMMM', false)],
        animeType: 'movie',
        productionType: 'adaptation',
        typeOfMaterialOrigin: 'light_novel',
        movies: [Movie.create({ name: 'MovieX', releaseDate: new Date(2021, 3, 1) })],
        seasons: [],
        isAdultContent: false,
      });

      expect(() =>
        movieAnime.addSeason({ seasonNumber: 1, releaseDate: new Date(), totalEpisodes: 10 }),
      ).toThrow('seasons: movies cannot have seasons');
    });
  });

  describe('update operations', () => {
    it('should update common info and image url', () => {
      const anime = Anime.create({
        imageUrl: 'http://example.com/img.png',
        name: 'Initial',
        synopsis: 'Initial long synopsis',
        category: Category.create('Initial', 'Inicial', 'General', 'Initial category desc'),
        genres: [Genre.create('Gen', 'GENGENGENGEN', false)],
        animeType: 'serie',
        productionType: 'original',
        typeOfMaterialOrigin: 'none',
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
        'synopsis: must be a string',
      );
      expect(() => anime.updateCommonInfo({ animeType: 123 as any })).toThrow(
        'animeType: must be a string',
      );

      anime.updateImageUrl('  https://example.com/new.png  ');
      expect(anime.imageUrl.value).toBe('https://example.com/new.png');

      expect(() => anime.updateImageUrl(123 as any)).toThrow('url: must be a non-empty string');
    });

    it('equals should compare properly', () => {
      const anime1 = Anime.create({
        imageUrl: 'http://example.com/img.png',
        name: 'Equal 1',
        synopsis: 'Long synopsis',
        category: Category.create('CatOne', 'CatUm', 'General', 'CCCCCCCCCC'),
        genres: [Genre.create('Gen1', 'GGGGGGGGGG', false)],
        animeType: 'serie',
        productionType: 'original',
        typeOfMaterialOrigin: 'none',
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
        category: Category.create('CatTwo', 'CatDois', 'General', 'CCCCCCCCCC'),
        genres: [Genre.create('Gen2', 'GGGGGGGGGG', false)],
        animeType: 'serie',
        productionType: 'original',
        typeOfMaterialOrigin: 'none',
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

    it('toDomain should reconstruct an Anime from a persistence-like structure', () => {
      const category = Category.create('Action', 'Ação', 'General', 'Action category');
      const genre = Genre.create('Adventure', 'Adventure desc', false);

      const movie = Movie.create({ name: 'Film Y', releaseDate: new Date(2022, 1, 1) });
      const season = Season.create({
        seasonNumber: 1,
        releaseDate: new Date(2021, 1, 1),
        totalEpisodes: 10,
      });

      const original = Anime.create({
        imageUrl: 'http://example.com/recon.png',
        name: 'Recon Anime',
        synopsis: 'Long enough synopsis for recon test',
        category,
        genres: [genre],
        animeType: 'mixed',
        productionType: 'original',
        typeOfMaterialOrigin: 'none',
        movies: [movie],
        seasons: [season],
        isAdultContent: false,
      });

      const doc = {
        id: original.id.value,
        imageUrl: original.imageUrl.value,
        name: original.name.value,
        synopsis: original.synopsis.value,
        category: category,
        genres: [genre],
        animeType: original.animeType,
        productionType: original.productionType,
        typeOfMaterialOrigin: original.typeOfMaterialOrigin,
        movies: original.movies,
        seasons: original.seasons,
        isAdultContent: original.isAdultContent,
        createdAt: original.createdAt,
        updatedAt: original.updatedAt,
      } as any;

      const reconstructed = Anime.toDomain(doc);

      expect(reconstructed).toBeDefined();
      expect(reconstructed.id.value).toBe(original.id.value);
      expect(reconstructed.imageUrl.value).toBe(original.imageUrl.value);
      expect(reconstructed.name.value).toBe(original.name.value);
      expect(reconstructed.genres.length).toBe(1);
      expect(reconstructed.movies.length).toBe(1);
      expect(reconstructed.seasons.length).toBe(1);
      expect(reconstructed.animeType).toBe(original.animeType);
      expect(reconstructed.typeOfMaterialOrigin).toBe(original.typeOfMaterialOrigin);
    });
  });
});
