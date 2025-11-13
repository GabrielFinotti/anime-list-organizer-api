type SeasonProps = {
  seasonNumber: number;
  releaseDate: Date;
  totalEpisodes: number;
};

class Season {
  private readonly _seasonNumber: number;
  private readonly _releaseDate: Date;
  private readonly _totalEpisodes: number;

  constructor(props: SeasonProps) {
    this._seasonNumber = props.seasonNumber;
    this._releaseDate = props.releaseDate;
    this._totalEpisodes = props.totalEpisodes;
  }

  get seasonNumber() {
    return this._seasonNumber;
  }

  get releaseDate() {
    return this._releaseDate;
  }

  get totalEpisodes() {
    return this._totalEpisodes;
  }

  static create(data: { seasonNumber: number; releaseDate: Date; totalEpisodes: number }) {
    this.validateNumberField(data.seasonNumber, 'seasonNumber');
    this.validateReleaseDate(data.releaseDate);
    this.validateNumberField(data.totalEpisodes, 'totalEpisodes');

    const seasonNumber = data.seasonNumber;
    const releaseDate = this.normalizeReleaseDate(data.releaseDate);
    const totalEpisodes = data.totalEpisodes;

    return new Season({ seasonNumber, releaseDate, totalEpisodes });
  }

  private static validateNumberField(field: number, fieldName: string) {
    if (typeof field !== 'number' || field <= 0 || !Number.isInteger(field)) {
      throw new Error(`Invalid value for ${fieldName}, must be a positive integer`);
    }
  }

  private static validateReleaseDate(releaseDate: Date) {
    if (!(releaseDate instanceof Date) || isNaN(releaseDate.getTime())) {
      throw new Error('Invalid release date');
    }
  }

  private static normalizeReleaseDate(releaseDate: Date): Date {
    return new Date(releaseDate.getFullYear(), releaseDate.getMonth(), releaseDate.getDate());
  }

  equals(other: Season) {
    return (
      this._seasonNumber === other._seasonNumber &&
      this._releaseDate.getTime() === other._releaseDate.getTime() &&
      this._totalEpisodes === other._totalEpisodes
    );
  }
}

export default Season;
