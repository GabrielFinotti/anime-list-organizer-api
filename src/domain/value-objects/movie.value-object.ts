import Name from './name.value-object.js';

type MovieProps = {
  title: Name;
  releaseDate: Date;
};

class Movie {
  private readonly _title: Name;
  private readonly _releaseDate: Date;

  private constructor(props: MovieProps) {
    this._title = props.title;
    this._releaseDate = props.releaseDate;
  }

  get title() {
    return this._title;
  }

  get releaseDate() {
    return this._releaseDate;
  }

  static create(data: { name: string; releaseDate: Date }) {
    this.validateReleaseDate(data.releaseDate);

    const title = Name.create(data.name);
    const releaseDate = this.normalizeReleaseDate(data.releaseDate);

    return new Movie({ title, releaseDate });
  }

  private static validateReleaseDate(releaseDate: Date) {
    if (!(releaseDate instanceof Date) || isNaN(releaseDate.getTime())) {
      throw new Error('Invalid release date');
    }
  }

  private static normalizeReleaseDate(releaseDate: Date) {
    return new Date(releaseDate.getFullYear(), releaseDate.getMonth(), releaseDate.getDate());
  }

  equals(other: Movie) {
    return (
      this._title.equals(other._title) &&
      this._releaseDate.getTime() === other._releaseDate.getTime()
    );
  }
}

export default Movie;
