import Name from './name.value-object.js';

type MovieProps = {
  title: Name;
  releaseDate: Date;
  isWatched: boolean;
  liked: boolean;
};

class Movie {
  private readonly _title: Name;
  private readonly _releaseDate: Date;
  private readonly _isWatched: boolean;
  private readonly _liked: boolean;

  private constructor(props: MovieProps) {
    this._title = props.title;
    this._releaseDate = props.releaseDate;
    this._isWatched = props.isWatched;
    this._liked = props.liked;
  }

  get title() {
    return this._title;
  }

  get releaseDate() {
    return this._releaseDate;
  }

  get isWatched() {
    return this._isWatched;
  }

  get liked() {
    return this._liked;
  }

  static create(data: { name: string; releaseDate: Date; isWatched: boolean; liked: boolean }) {
    this.validateReleaseDate(data.releaseDate);
    this.validateBooleanField(data.isWatched, 'isWatched');
    this.validateBooleanField(data.liked, 'liked');

    const title = Name.create(data.name);
    const releaseDate = this.normalizeReleaseDate(data.releaseDate);
    const isWatched = data.isWatched;
    const liked = data.liked;

    return new Movie({ title, releaseDate, isWatched, liked });
  }

  private static validateReleaseDate(releaseDate: Date) {
    if (!(releaseDate instanceof Date) || isNaN(releaseDate.getTime())) {
      throw new Error('Invalid release date');
    }
  }

  private static validateBooleanField(field: boolean, fieldName: string) {
    if (typeof field !== 'boolean') {
      throw new Error(`Invalid value for ${fieldName}, must be a boolean`);
    }
  }

  private static normalizeReleaseDate(releaseDate: Date) {
    return new Date(releaseDate.getFullYear(), releaseDate.getMonth(), releaseDate.getDate());
  }

  equals(other: Movie) {
    return (
      this._title.equals(other._title) &&
      this._releaseDate.getTime() === other._releaseDate.getTime() &&
      this._isWatched === other._isWatched &&
      this._liked === other._liked
    );
  }
}

export default Movie;
