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
  favoriteAnimes: {
    list: Anime[];
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
  private _favoriteAnimes: {
    list: Anime[];
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
    this._favoriteAnimes = { ...props.favoriteAnimes };
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
    return { ...this._favoriteAnimes };
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
    const favoriteAnimes = {
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
      favoriteAnimes,
      role,
      createdAt,
      updatedAt,
    });
  }

  private static validateRole(role: Role) {
    if (!this.VALID_ROLES.includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }
  }

  addAnimeToAnimeList(anime: Anime) {
    const alreadyExists = this._animeList.list.some((animeStatus) =>
      animeStatus.anime.equals(anime),
    );

    if (alreadyExists) throw new Error('Anime is already in the anime list');

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

  removeAnimeFromAnimeList(anime: Anime) {
    const exists = this._animeList.list.some((animeStatus) => animeStatus.anime.equals(anime));

    if (!exists) throw new Error('Anime is not in the anime list');

    this._animeList.list = this._animeList.list.filter(
      (animeStatus) => !animeStatus.anime.equals(anime),
    );
    this._animeList.updatedAt = new Date();
    this._updatedAt = new Date();
  }

  updateMovieStatus(anime: Anime, movieStatus: MovieStatus) {
    const animeStatus = this._animeList.list.find((status) => status.anime.equals(anime));

    if (!animeStatus) throw new Error('Anime not found in anime list');

    const movieBelongsToAnime = anime.movies.some((m) => m.equals(movieStatus.movie));

    if (!movieBelongsToAnime) throw new Error('Movie does not belong to the anime');

    const movieStatusIndex = animeStatus.moviesStatus.findIndex((ms) =>
      ms.movie.equals(movieStatus.movie),
    );

    if (movieStatusIndex === -1) throw new Error('Movie not found in anime status');

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

    if (!animeStatus) throw new Error('Anime not found in anime list');

    const seasonBelongsToAnime = anime.seasons.some((s) => s.equals(seasonStatus.season));

    if (!seasonBelongsToAnime) throw new Error('Season does not belong to the anime');

    const seasonStatusIndex = animeStatus.seasonsStatus.findIndex((ss) =>
      ss.season.equals(seasonStatus.season),
    );

    if (seasonStatusIndex === -1) throw new Error('Season not found in anime status');

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
  addAnimeToFavorites(anime: Anime) {
    const alreadyFavorited = this._favoriteAnimes.list.some((favAnime) => favAnime.equals(anime));

    if (alreadyFavorited) throw new Error('Anime is already in favorites');

    this._favoriteAnimes.list.push(anime);
    this._favoriteAnimes.updatedAt = new Date();
    this._updatedAt = new Date();
  }

  removeAnimeFromFavorites(anime: Anime) {
    const exists = this._favoriteAnimes.list.some((favAnime) => favAnime.equals(anime));

    if (!exists) throw new Error('Anime is not in favorites');

    this._favoriteAnimes.list = this._favoriteAnimes.list.filter(
      (favAnime) => !favAnime.equals(anime),
    );
    this._favoriteAnimes.updatedAt = new Date();
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
    favoriteAnimes: {
      list: Anime[];
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
      favoriteAnimes: data.favoriteAnimes,
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
