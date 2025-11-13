import Movie from '../../../../src/domain/value-objects/movie.value-object';
import Name from '../../../../src/domain/value-objects/name.value-object';

describe('Movie Value Object', () => {
  describe('create', () => {
    it('should create a Movie with valid data', () => {
      const movie = Movie.create({
        name: 'My Movie',
        releaseDate: new Date(2023, 10, 5, 15, 30),
        isWatched: true,
        liked: false,
      });

      expect(movie.title).toBeInstanceOf(Name);
      expect(movie.title.value).toBe('my movie');
      expect(movie.releaseDate.getHours()).toBe(0);
      expect(movie.isWatched).toBe(true);
      expect(movie.liked).toBe(false);
    });

    it('should throw when releaseDate is invalid', () => {
      expect(() =>
        Movie.create({ name: 'M', releaseDate: new Date('invalid'), isWatched: true, liked: true }),
      ).toThrow('Invalid release date');
    });

    it('should throw when boolean fields are not booleans', () => {
      expect(() =>
        Movie.create({
          name: 'M',
          releaseDate: new Date(2020, 0, 1),
          isWatched: 'yes' as any,
          liked: true,
        }),
      ).toThrow('Invalid value for isWatched, must be a boolean');
      expect(() =>
        Movie.create({
          name: 'M',
          releaseDate: new Date(2020, 0, 1),
          isWatched: true,
          liked: 'yes' as any,
        }),
      ).toThrow('Invalid value for liked, must be a boolean');
    });

    it('equals should compare properly', () => {
      const date = new Date(2022, 6, 15, 10, 30);
      const m1 = Movie.create({ name: 'Same', releaseDate: date, isWatched: true, liked: true });
      const m2 = Movie.create({ name: 'Same', releaseDate: date, isWatched: true, liked: true });
      const m3 = Movie.create({ name: 'Other', releaseDate: date, isWatched: true, liked: true });

      expect(m1.equals(m2)).toBe(true);
      expect(m1.equals(m3)).toBe(false);
    });
  });
});
