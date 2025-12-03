import AnimeStatus from '../value-objects/animeStatus.js';
import Description from '../value-objects/description.value-object.js';
import Email from '../value-objects/email.value-object.js';
import Id from '../value-objects/id.value-object.js';
import MovieStatus from '../value-objects/movieStatus.value-object.js';
import Name from '../value-objects/name.value-object.js';
import Password from '../value-objects/password.value-object.js';
import SeasonStatus from '../value-objects/seasonStatus.value-object.js';
import Url from '../value-objects/url.value-object.js';
import Anime from './Anime.entity.js';
import { InvalidValueError, BusinessRuleError } from '../errors/index.js';

type Role = 'user' | 'admin';

type UserProps = {
  id: Id;
  imageUrl: Url;
  username: Name;
  email: Email;
  password: Password;
  biography: Description;
  animeList: {
    list: AnimeStatus[];
    updatedAt: Date;
  };
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

class User {
  private readonly _id: Id;
  private _imageUrl: Url;
  private _username: Name;
  private _email: Email;
  private _password: Password;
  private _biography: Description;
  private _animeList: {
    list: AnimeStatus[];
    updatedAt: Date;
  };
  private readonly _role: Role;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private static readonly VALID_ROLES: Role[] = ['user', 'admin'];

  private constructor(props: UserProps) {
    this._id = props.id;
    this._imageUrl = props.imageUrl;
    this._username = props.username;
    this._email = props.email;
    this._password = props.password;
    this._biography = props.biography;
    this._animeList = { ...props.animeList };
    this._role = props.role;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id() {
    return this._id;
  }

  get imageUrl() {
    return this._imageUrl;
  }

  get username() {
    return this._username;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  get biography() {
    return this._biography;
  }

  get animeList() {
    return { ...this._animeList };
  }

  get favoriteAnimes() {
    return [
      ...this._animeList.list
        .filter((animeStatus) => animeStatus.isLiked)
        .map((status) => status.anime),
    ];
  }

  get role() {
    return this._role;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  static create(data: {
    imageUrl: string;
    username: string;
    email: string;
    password: string;
    biography: string;
    role?: Role;
  }): User {
    const normalizedRole = data.role ?? 'user';

    this.validateRole(normalizedRole);

    const id = Id.generateRandomId();
    const imageUrl = Url.create(data.imageUrl);
    const username = Name.create(data.username);
    const email = Email.create(data.email);
    const password = Password.create(data.password);
    const biography = Description.create(data.biography);
    const animeList = {
      list: [],
      updatedAt: new Date(),
    };
    const role = normalizedRole;
    const createdAt = new Date();
    const updatedAt = new Date();

    return new User({
      id,
      imageUrl,
      username,
      email,
      password,
      biography,
      animeList,
      role,
      createdAt,
      updatedAt,
    });
  }

  private static validateRole(role: Role) {
    if (!this.VALID_ROLES.includes(role)) {
      throw new InvalidValueError({
        message: `role: must be one of ${this.VALID_ROLES.join(', ')}`,
        field: 'role',
        allowedValues: this.VALID_ROLES,
      });
    }
  }

  private createMoviesStatusForAnime(movies: Anime['movies']) {
    const animeMovieStatus: MovieStatus[] = [];

    movies.forEach((movie) => {
      const movieStatus = MovieStatus.create({
        movie,
        status: 'in_list',
        isLiked: false,
      });

      animeMovieStatus.push(movieStatus);
    });

    return animeMovieStatus;
  }

  private createSeasonsStatusForAnime(seasons: Anime['seasons']) {
    const animeSeasonStatus: SeasonStatus[] = [];

    seasons.forEach((season) => {
      const seasonStatus = SeasonStatus.create({
        season,
        status: 'in_list',
        lastEpisodeWatched: 0,
        isLiked: false,
      });

      animeSeasonStatus.push(seasonStatus);
    });

    return animeSeasonStatus;
  }

  addAnimeToAnimeList(anime: Anime) {
    const alreadyExists = this._animeList.list.some((animeStatus) =>
      animeStatus.anime.equals(anime),
    );

    if (alreadyExists) {
      throw new BusinessRuleError({
        message: 'animeList: anime is already in the list',
        field: 'animeList',
        rule: 'already_exists',
      });
    }

    const moviesStatus = this.createMoviesStatusForAnime(anime.movies);
    const seasonsStatus = this.createSeasonsStatusForAnime(anime.seasons);

    const newAnimeStatus = AnimeStatus.create({
      anime,
      status: 'in_list',
      moviesStatus,
      seasonsStatus,
      isLiked: false,
    });

    this._animeList.list.push(newAnimeStatus);
    this._animeList.updatedAt = new Date();
    this._updatedAt = new Date();
  }

  removeAnimeFromAnimeList(anime: Anime) {
    const exists = this._animeList.list.some((animeStatus) => animeStatus.anime.equals(anime));

    if (!exists) {
      throw new BusinessRuleError({
        message: 'animeList: anime is not in the list',
        field: 'animeList',
        rule: 'not_found',
      });
    }

    this._animeList.list = this._animeList.list.filter(
      (animeStatus) => !animeStatus.anime.equals(anime),
    );
    this._animeList.updatedAt = new Date();
    this._updatedAt = new Date();
  }

  updateAnimeLikeStatus(anime: Anime) {
    const animeStatus = this._animeList.list.find((status) => status.anime.equals(anime));

    if (!animeStatus) {
      throw new BusinessRuleError({
        message: 'animeList: anime not found in list',
        field: 'animeList',
        rule: 'not_found',
      });
    }

    const updatedAnimeStatus = AnimeStatus.create({
      anime: animeStatus.anime,
      status: animeStatus.status,
      moviesStatus: animeStatus.moviesStatus,
      seasonsStatus: animeStatus.seasonsStatus,
      isLiked: !animeStatus.isLiked,
    });

    const animeIndex = this._animeList.list.findIndex((s) => s.anime.equals(anime));

    this._animeList.list[animeIndex] = updatedAnimeStatus;
    this._animeList.updatedAt = new Date();
    this._updatedAt = new Date();
  }

  updateMovieStatus(anime: Anime, movieStatus: MovieStatus) {
    const animeStatus = this._animeList.list.find((status) => status.anime.equals(anime));

    if (!animeStatus) {
      throw new BusinessRuleError({
        message: 'animeList: anime not found in list',
        field: 'animeList',
        rule: 'not_found',
      });
    }

    const movieBelongsToAnime = anime.movies.some((m) => m.equals(movieStatus.movie));

    if (!movieBelongsToAnime) {
      throw new BusinessRuleError({
        message: 'movie: does not belong to the anime',
        field: 'movie',
        rule: 'invalid_association',
      });
    }

    const movieStatusIndex = animeStatus.moviesStatus.findIndex((ms) =>
      ms.movie.equals(movieStatus.movie),
    );

    if (movieStatusIndex === -1) {
      throw new BusinessRuleError({
        message: 'movieStatus: movie not found in anime status',
        field: 'movieStatus',
        rule: 'not_found',
      });
    }

    const updatedMoviesStatus = animeStatus.moviesStatus.map((ms) =>
      ms.movie.equals(movieStatus.movie) ? movieStatus : ms,
    );

    const updatedAnimeStatus = AnimeStatus.create({
      anime: animeStatus.anime,
      status: animeStatus.status,
      moviesStatus: updatedMoviesStatus,
      seasonsStatus: animeStatus.seasonsStatus,
      isLiked: animeStatus.isLiked,
    });

    const animeIndex = this._animeList.list.findIndex((s) => s.anime.equals(anime));

    this._animeList.list[animeIndex] = updatedAnimeStatus;
    this._animeList.updatedAt = new Date();
    this._updatedAt = new Date();
  }

  updateSeasonStatus(anime: Anime, seasonStatus: SeasonStatus) {
    const animeStatus = this._animeList.list.find((status) => status.anime.equals(anime));

    if (!animeStatus) {
      throw new BusinessRuleError({
        message: 'animeList: anime not found in list',
        field: 'animeList',
        rule: 'not_found',
      });
    }

    const seasonBelongsToAnime = anime.seasons.some((s) => s.equals(seasonStatus.season));

    if (!seasonBelongsToAnime) {
      throw new BusinessRuleError({
        message: 'season: does not belong to the anime',
        field: 'season',
        rule: 'invalid_association',
      });
    }

    const seasonStatusIndex = animeStatus.seasonsStatus.findIndex((ss) =>
      ss.season.equals(seasonStatus.season),
    );

    if (seasonStatusIndex === -1) {
      throw new BusinessRuleError({
        message: 'seasonStatus: season not found in anime status',
        field: 'seasonStatus',
        rule: 'not_found',
      });
    }

    const updatedSeasonsStatus = animeStatus.seasonsStatus.map((ss) =>
      ss.season.equals(seasonStatus.season) ? seasonStatus : ss,
    );

    const updatedAnimeStatusForSeason = AnimeStatus.create({
      anime: animeStatus.anime,
      status: animeStatus.status,
      moviesStatus: animeStatus.moviesStatus,
      seasonsStatus: updatedSeasonsStatus,
      isLiked: animeStatus.isLiked,
    });

    const animeIndexSeason = this._animeList.list.findIndex((s) => s.anime.equals(anime));
    this._animeList.list[animeIndexSeason] = updatedAnimeStatusForSeason;
    this._animeList.updatedAt = new Date();
    this._updatedAt = new Date();
  }

  updateProfileImage(newImageUrl: string) {
    const updatedUrl = Url.create(newImageUrl);

    this._imageUrl = updatedUrl;
    this._updatedAt = new Date();
  }

  updateCommonInfo(data: {
    username?: string;
    email?: string;
    password?: string;
    biography?: string;
  }) {
    if (data.username) this._username = Name.create(data.username);
    if (data.email) this._email = Email.create(data.email);
    if (data.password) this._password = Password.create(data.password);
    if (data.biography) this._biography = Description.create(data.biography);

    this._updatedAt = new Date();
  }

  static toDomain(data: {
    id: string;
    imageUrl: string;
    username: string;
    email: string;
    password: string;
    biography: string;
    animeList: {
      list: AnimeStatus[];
      updatedAt: Date;
    };
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new User({
      id: Id.create(data.id),
      imageUrl: Url.create(data.imageUrl),
      username: Name.create(data.username),
      email: Email.create(data.email),
      password: Password.createFromHash(data.password),
      biography: Description.create(data.biography),
      animeList: data.animeList,
      role: data.role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  equals(other: User) {
    return this._id.equals(other._id);
  }
}

export default User;
