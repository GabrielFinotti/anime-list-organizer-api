import Movie from './movie.value-object.js';
import { InvalidValueError } from '../errors/index.js';

type Status = 'watching' | 'finished' | 'in_list';

class MovieStatus {
  private readonly _movie: Movie;
  private readonly _status: Status;
  private readonly _isLiked: boolean;

  private static readonly validStatuses = ['watching', 'finished', 'in_list'];

  private constructor(props: { movie: Movie; status: Status; isLiked: boolean }) {
    this._movie = props.movie;
    this._status = props.status;
    this._isLiked = props.isLiked;
  }

  get movie() {
    return this._movie;
  }

  get status() {
    return this._status;
  }

  get isLiked() {
    return this._isLiked;
  }

  static create(data: { movie: Movie; status: Status; isLiked: boolean }) {
    const normalizedStatus = data.status.toLowerCase().trim();

    this.validateStatus(normalizedStatus);
    this.validateIsLiked(data.isLiked);

    const movie = data.movie;
    const status = normalizedStatus as Status;
    const isLiked = data.isLiked;

    return new MovieStatus({ movie, status, isLiked });
  }

  private static validateStatus(status: string) {
    if (!this.validStatuses.includes(status)) {
      throw new InvalidValueError({
        message: `status: must be one of ${this.validStatuses.join(', ')}`,
        field: 'status',
        allowedValues: this.validStatuses,
      });
    }
  }

  private static validateIsLiked(isLiked: boolean) {
    if (typeof isLiked !== 'boolean') {
      throw new InvalidValueError({
        message: 'isLiked: must be a boolean',
        field: 'isLiked',
      });
    }
  }

  equals(other: MovieStatus) {
    return (
      this._movie.equals(other._movie) &&
      this._status === other._status &&
      this._isLiked === other._isLiked
    );
  }
}

export default MovieStatus;
