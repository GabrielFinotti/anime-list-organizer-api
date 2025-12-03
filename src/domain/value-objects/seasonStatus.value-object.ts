import Season from './season.value-object.js';
import { InvalidValueError } from '../errors/index.js';

type Status = 'watching' | 'finished' | 'in_list';

class SeasonStatus {
  private readonly _season: Season;
  private readonly _status: Status;
  private readonly _lastEpisodeWatched: number;
  private readonly _isLiked: boolean;

  private static readonly validStatuses = ['watching', 'finished', 'in_list'];

  private constructor(props: {
    season: Season;
    status: Status;
    lastEpisodeWatched: number;
    isLiked: boolean;
  }) {
    this._season = props.season;
    this._status = props.status;
    this._lastEpisodeWatched = props.lastEpisodeWatched;
    this._isLiked = props.isLiked;
  }

  get season() {
    return this._season;
  }

  get status() {
    return this._status;
  }

  get lastEpisodeWatched() {
    return this._lastEpisodeWatched;
  }

  get isLiked() {
    return this._isLiked;
  }

  static create(data: {
    season: Season;
    status: Status;
    lastEpisodeWatched: number;
    isLiked: boolean;
  }) {
    const normalizedStatus = data.status.toLowerCase().trim();

    this.validateStatus(normalizedStatus);
    this.validateLastEpisodeWatched(data.lastEpisodeWatched);
    this.validateIsLiked(data.isLiked);

    const season = data.season;
    const status = normalizedStatus as Status;
    const lastEpisodeWatched = data.lastEpisodeWatched;
    const isLiked = data.isLiked;

    return new SeasonStatus({ season, status, lastEpisodeWatched, isLiked });
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

  private static validateLastEpisodeWatched(lastEpisodeWatched: number) {
    if (typeof lastEpisodeWatched !== 'number' || lastEpisodeWatched < 0) {
      throw new InvalidValueError({
        message: 'lastEpisodeWatched: must be a non-negative number',
        field: 'lastEpisodeWatched',
        min: 0,
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

  equals(other: SeasonStatus) {
    return (
      this._season.equals(other._season) &&
      this._status === other._status &&
      this._lastEpisodeWatched === other._lastEpisodeWatched &&
      this._isLiked === other._isLiked
    );
  }
}

export default SeasonStatus;
