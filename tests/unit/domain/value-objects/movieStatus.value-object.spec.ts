import Movie from '../../../../src/domain/value-objects/movie.value-object';
import MovieStatus from '../../../../src/domain/value-objects/movieStatus.value-object';

describe('MovieStatus Value Object', () => {
  describe('create', () => {
    it('should create a MovieStatus with valid data', () => {
      const movie = Movie.create({ name: 'My Movie', releaseDate: new Date(2023, 10, 5) });

      const ms = MovieStatus.create({ movies: movie, status: 'watching', isLiked: true });

      expect(ms.movies).toBeInstanceOf(Movie);
      expect(ms.status).toBe('watching');
      expect(ms.isLiked).toBe(true);
    });

    it('should throw when status is invalid', () => {
      const movie = Movie.create({ name: 'My Movie', releaseDate: new Date(2023, 10, 5) });

      expect(() =>
        MovieStatus.create({ movies: movie, status: 'dropped' as any, isLiked: false }),
      ).toThrow('Invalid status: dropped, must be one of watching, finished, in_list');
    });

    it('should throw when isLiked is not boolean', () => {
      const movie = Movie.create({ name: 'My Movie', releaseDate: new Date(2023, 10, 5) });

      expect(() =>
        MovieStatus.create({ movies: movie, status: 'watching', isLiked: 'yes' as any }),
      ).toThrow('isLiked must be a boolean value');
    });

    it('equals should compare properly', () => {
      const date = new Date(2022, 6, 15);
      const m1 = Movie.create({ name: 'Same', releaseDate: date });
      const m2 = Movie.create({ name: 'Same', releaseDate: date });
      const ms1 = MovieStatus.create({ movies: m1, status: 'watching', isLiked: true });
      const ms2 = MovieStatus.create({ movies: m2, status: 'watching', isLiked: true });
      const ms3 = MovieStatus.create({ movies: m2, status: 'finished', isLiked: false });

      expect(ms1.equals(ms2)).toBe(true);
      expect(ms1.equals(ms3)).toBe(false);
    });
  });
});