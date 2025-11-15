import Anime from '../entities/Anime.entity.js';
import MovieStatus from './movieStatus.value-object.js';
import SeasonStatus from './seasonStatus.value-object.js';

type Status = 'watching' | 'finished' | 'dropped' | 'in_list';

class AnimeStatus {
  private readonly _anime: Anime;
  private readonly _status: Status;
  private readonly _moviesStatus: MovieStatus[];
  private readonly _seasonsStatus: SeasonStatus[];
  private readonly _isLiked: boolean;
  private static readonly validStatuses = ['watching', 'finished', 'dropped', 'in_list'];

  private constructor(props: {
    anime: Anime;
    status: Status;
    moviesStatus: MovieStatus[];
    seasonsStatus: SeasonStatus[];
    isLiked: boolean;
  }) {
    this._anime = props.anime;
    this._status = props.status;
    this._moviesStatus = [...props.moviesStatus];
    this._seasonsStatus = [...props.seasonsStatus];
    this._isLiked = props.isLiked;
  }

  get anime() {
    return this._anime;
  }

  get status() {
    return this._status;
  }

  get moviesStatus() {
    return [...this._moviesStatus];
  }

  get seasonsStatus() {
    return [...this._seasonsStatus];
  }

  get isLiked() {
    return this._isLiked;
  }

  static create(data: {
    anime: Anime;
    status: Status;
    moviesStatus: MovieStatus[];
    seasonsStatus: SeasonStatus[];
    isLiked: boolean;
  }): AnimeStatus {
    const normalizedStatus = data.status.toLowerCase().trim();

    this.validateStatus(normalizedStatus);
    this.validateIsLiked(data.isLiked);

    const anime = data.anime;
    const status = normalizedStatus as Status;
    const moviesStatus = data.moviesStatus;
    const seasonsStatus = data.seasonsStatus;
    const isLiked = data.isLiked;

    return new AnimeStatus({ anime, status, moviesStatus, seasonsStatus, isLiked });
  }

  private static validateStatus(status: string) {
    if (!this.validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}, must be one of ${this.validStatuses.join(', ')}`);
    }
  }

  private static validateIsLiked(isLiked: boolean) {
    if (typeof isLiked !== 'boolean') {
      throw new Error('isLiked must be a boolean value');
    }
  }

  equals(other: AnimeStatus) {
    return (
      this._anime.equals(other._anime) &&
      this._status === other._status &&
      this._moviesStatus.length === other._moviesStatus.length &&
      this._moviesStatus.every((movieStatus, index) =>
        movieStatus.equals(other._moviesStatus[index]),
      ) &&
      this._seasonsStatus.length === other._seasonsStatus.length &&
      this._seasonsStatus.every((seasonStatus, index) =>
        seasonStatus.equals(other._seasonsStatus[index]),
      ) &&
      this._isLiked === other._isLiked
    );
  }
}

export default AnimeStatus;
