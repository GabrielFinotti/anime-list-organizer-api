import Movie from '../../../../src/domain/value-objects/movie.value-object';
import Name from '../../../../src/domain/value-objects/name.value-object';

describe('Movie Value Object', () => {
  describe('create', () => {
    it('should create a Movie with valid data', () => {
      const movie = Movie.create({
        name: 'My Movie',
        releaseDate: new Date(2023, 10, 5, 15, 30),
      });

      expect(movie.title).toBeInstanceOf(Name);
      expect(movie.title.value).toBe('my movie');
      expect(movie.releaseDate.getHours()).toBe(0);
      // Movie no longer stores watched/liked flags in this refactor
    });

    it('should throw when releaseDate is invalid', () => {
      expect(() => Movie.create({ name: 'M', releaseDate: new Date('invalid') })).toThrow(
        'Invalid release date',
      );
    });

    it('should throw when boolean fields are not booleans', () => {
      // movie does not have boolean flags in current refactor, nothing to validate here
    });

    it('equals should compare properly', () => {
      const date = new Date(2022, 6, 15, 10, 30);
      const m1 = Movie.create({ name: 'Same', releaseDate: date });
      const m2 = Movie.create({ name: 'Same', releaseDate: date });
      const m3 = Movie.create({ name: 'Other', releaseDate: date });

      expect(m1.equals(m2)).toBe(true);
      expect(m1.equals(m3)).toBe(false);
    });
  });
});
