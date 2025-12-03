import Season from '../../../../src/domain/value-objects/season.value-object';

describe('Season Value Object', () => {
  describe('create', () => {
    it('should create a Season with valid data', () => {
      const season = Season.create({
        seasonNumber: 1,
        releaseDate: new Date(2021, 4, 10, 9, 30),
        totalEpisodes: 12,
      });

      expect(season.seasonNumber).toBe(1);
      expect(season.totalEpisodes).toBe(12);
      expect(season.releaseDate.getHours()).toBe(0);
    });

    it('should throw when number fields are invalid', () => {
      expect(() =>
        Season.create({ seasonNumber: 0, releaseDate: new Date(2021, 4, 10), totalEpisodes: 12 }),
      ).toThrow('seasonNumber: must be a positive integer');
      expect(() =>
        Season.create({ seasonNumber: 1.5, releaseDate: new Date(2021, 4, 10), totalEpisodes: 12 }),
      ).toThrow('seasonNumber: must be a positive integer');
      expect(() =>
        Season.create({ seasonNumber: 1, releaseDate: new Date(2021, 4, 10), totalEpisodes: 0 }),
      ).toThrow('totalEpisodes: must be a positive integer');
    });

    it('should throw when releaseDate is invalid', () => {
      expect(() =>
        Season.create({ seasonNumber: 1, releaseDate: new Date('invalid'), totalEpisodes: 12 }),
      ).toThrow('releaseDate: invalid date');
    });

    it('equals should compare properly', () => {
      const date = new Date(2021, 1, 20, 8, 30);
      const s1 = Season.create({ seasonNumber: 1, releaseDate: date, totalEpisodes: 10 });
      const s2 = Season.create({ seasonNumber: 1, releaseDate: date, totalEpisodes: 10 });
      const s3 = Season.create({ seasonNumber: 2, releaseDate: date, totalEpisodes: 12 });

      expect(s1.equals(s2)).toBe(true);
      expect(s1.equals(s3)).toBe(false);
    });
  });
});
