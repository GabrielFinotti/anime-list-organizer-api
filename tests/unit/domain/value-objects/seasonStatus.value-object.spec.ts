import Season from '../../../../src/domain/value-objects/season.value-object';
import SeasonStatus from '../../../../src/domain/value-objects/seasonStatus.value-object';

describe('SeasonStatus Value Object', () => {
  describe('create', () => {
    it('should create a SeasonStatus with valid data', () => {
      const season = Season.create({ seasonNumber: 1, releaseDate: new Date(2021, 4, 10), totalEpisodes: 12 });

      const ss = SeasonStatus.create({ season, status: 'watching', lastEpisodeWatched: 2, isLiked: true });

      expect(ss.season).toBeInstanceOf(Season);
      expect(ss.status).toBe('watching');
      expect(ss.lastEpisodeWatched).toBe(2);
      expect(ss.isLiked).toBe(true);
    });

    it('should throw when lastEpisodeWatched is invalid', () => {
      const season = Season.create({ seasonNumber: 1, releaseDate: new Date(2021, 4, 10), totalEpisodes: 12 });

      expect(() => SeasonStatus.create({ season, status: 'watching', lastEpisodeWatched: -1, isLiked: false })).toThrow(
        'lastEpisodeWatched must be a non-negative number',
      );
    });

    it('should throw when status is invalid', () => {
      const season = Season.create({ seasonNumber: 1, releaseDate: new Date(2021, 4, 10), totalEpisodes: 12 });

      expect(() => SeasonStatus.create({ season, status: 'dropped' as any, lastEpisodeWatched: 0, isLiked: false })).toThrow(
        'Invalid status: dropped, must be one of watching, finished, in_list',
      );
    });

    it('equals should compare properly', () => {
      const date = new Date(2021, 1, 20);
      const s1 = Season.create({ seasonNumber: 1, releaseDate: date, totalEpisodes: 10 });
      const s2 = Season.create({ seasonNumber: 1, releaseDate: date, totalEpisodes: 10 });
      const s3 = Season.create({ seasonNumber: 2, releaseDate: date, totalEpisodes: 12 });

      const ss1 = SeasonStatus.create({ season: s1, status: 'watching', lastEpisodeWatched: 1, isLiked: true });
      const ss2 = SeasonStatus.create({ season: s2, status: 'watching', lastEpisodeWatched: 1, isLiked: true });
      const ss3 = SeasonStatus.create({ season: s3, status: 'watching', lastEpisodeWatched: 1, isLiked: true });

      expect(ss1.equals(ss2)).toBe(true);
      expect(ss1.equals(ss3)).toBe(false);
    });
  });
});