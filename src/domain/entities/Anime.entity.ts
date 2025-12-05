import Description from '../value-objects/description.value-object.js';
import Id from '../value-objects/id.value-object.js';
import Movie from '../value-objects/movie.value-object.js';
import Name from '../value-objects/name.value-object.js';
import Season from '../value-objects/season.value-object.js';
import Url from '../value-objects/url.value-object.js';
import Category from './Category.entity.js';
import Genre from './Genre.entity.js';
import { InvalidValueError, BusinessRuleError } from '../errors/index.js';

type AnimeType = 'serie' | 'movie' | 'mixed';
type ProductionType = 'original' | 'adaptation';

type AnimeProps = {
  id: Id;
  imageUrl: Url;
  name: Name;
  synopsis: Description;
  category: Category;
  genres: Genre[];
  animeType: AnimeType;
  productionType: ProductionType;
  movies: Movie[];
  seasons: Season[];
  isAdultContent: boolean;
  createdAt: Date;
  updatedAt: Date;
};

class Anime {
  private readonly _id: Id;
  private _imageUrl: Url;
  private _name: Name;
  private _synopsis: Description;
  private _category: Category;
  private _genres: Genre[];
  private _animeType: AnimeType;
  private _productionType: ProductionType;
  private _movies: Movie[];
  private _seasons: Season[];
  private _isAdultContent: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private static readonly ANIME_TYPES = ['serie', 'movie', 'mixed'];
  private static readonly PRODUCTION_TYPES = ['original', 'adaptation'];

  private constructor(props: AnimeProps) {
    this._id = props.id;
    this._imageUrl = props.imageUrl;
    this._name = props.name;
    this._synopsis = props.synopsis;
    this._category = props.category;
    this._genres = [...props.genres];
    this._animeType = props.animeType;
    this._productionType = props.productionType;
    this._movies = [...props.movies];
    this._seasons = [...props.seasons];
    this._isAdultContent = props.isAdultContent;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id() {
    return this._id;
  }

  get imageUrl() {
    return this._imageUrl;
  }

  get name() {
    return this._name;
  }

  get synopsis() {
    return this._synopsis;
  }

  get category() {
    return this._category;
  }

  get genres() {
    return [...this._genres];
  }

  get animeType() {
    return this._animeType;
  }

  get productionType() {
    return this._productionType;
  }

  get movies() {
    return [...this._movies];
  }

  get seasons() {
    return [...this._seasons];
  }

  get totalSeasons() {
    return this._seasons.length;
  }

  get isAdultContent() {
    return this._isAdultContent;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  static create(data: {
    imageUrl: string;
    name: string;
    synopsis: string;
    category: Category;
    genres: Genre[];
    animeType: string;
    productionType: string;
    movies: Movie[];
    seasons: Season[];
    isAdultContent: boolean;
  }) {
    if (typeof data.animeType !== 'string') {
      throw new InvalidValueError({
        message: 'animeType: must be a string',
        field: 'animeType',
      });
    }

    if (data.genres.length === 0) {
      throw new InvalidValueError({
        message: 'genres: at least one genre must be provided',
        field: 'genres',
        min: 1,
      });
    }

    if (typeof data.productionType !== 'string') {
      throw new InvalidValueError({
        message: 'productionType: must be a string',
        field: 'productionType',
      });
    }

    const normalizedAnimeType = data.animeType.toLowerCase().trim();
    const normalizedProductionType = data.productionType.toLowerCase().trim();

    this.validateEnumFields(normalizedAnimeType, normalizedProductionType);
    this.validateBooleanFields(data.isAdultContent, 'Adult content flag');
    this.ensureUniqueGenres(data.genres);
    this.validateCreateMovies(normalizedAnimeType, data.movies);
    this.validateCreateSeasons(normalizedAnimeType, data.seasons);

    data.movies.length > 0 && this.ensureUniqueMovies(data.movies);
    data.seasons.length > 0 && this.ensureUniqueSeasons(data.seasons);

    const id = Id.generateRandomId();
    const imageUrl = Url.create(data.imageUrl);
    const name = Name.create(data.name);
    const synopsis = Description.create(data.synopsis);
    const category = data.category;
    const genres = data.genres;
    const animeType = normalizedAnimeType as AnimeType;
    const productionType = normalizedProductionType as ProductionType;
    const movies = data.movies;
    const seasons = data.seasons;
    const isAdultContent = data.isAdultContent;
    const createdAt = new Date();
    const updatedAt = new Date();

    return new Anime({
      id,
      imageUrl,
      name,
      synopsis,
      category,
      genres,
      animeType,
      productionType,
      movies,
      seasons,
      isAdultContent,
      createdAt,
      updatedAt,
    });
  }

  private static validateBooleanFields(field: boolean, fieldName: string) {
    if (typeof field !== 'boolean') {
      throw new InvalidValueError({
        message: `${fieldName}: must be a boolean`,
        field: fieldName,
      });
    }
  }

  private static validateEnumFields(animeType: string, productionType: string) {
    if (!Anime.ANIME_TYPES.includes(animeType)) {
      throw new InvalidValueError({
        message: `animeType: must be one of ${Anime.ANIME_TYPES.join(', ')}`,
        field: 'animeType',
        allowedValues: Anime.ANIME_TYPES,
      });
    }

    if (!Anime.PRODUCTION_TYPES.includes(productionType)) {
      throw new InvalidValueError({
        message: `productionType: must be one of ${Anime.PRODUCTION_TYPES.join(', ')}`,
        field: 'productionType',
        allowedValues: Anime.PRODUCTION_TYPES,
      });
    }
  }

  private static ensureUniqueGenres(genres: Genre[]) {
    this.ensureUnique(genres, (g) => g.id.value, 'genres');
  }

  private static ensureUniqueMovies(movies: Movie[]) {
    this.ensureUnique(movies, (m) => `${m.title.value}|${m.releaseDate.getTime()}`, 'movies');
  }

  private static ensureUniqueSeasons(seasons: Season[]) {
    this.ensureUnique(seasons, (s) => `${s.seasonNumber}|${s.releaseDate.getTime()}`, 'seasons');
  }

  private static ensureUnique<T>(items: T[], keySelector: (item: T) => string, fieldName: string) {
    const keys = new Set<string>();

    for (const item of items) {
      const key = keySelector(item);

      if (keys.has(key)) {
        throw new BusinessRuleError({
          message: `${fieldName}: duplicate items detected`,
          field: fieldName,
          rule: 'unique_items',
        });
      }

      keys.add(key);
    }
  }

  private static validateCreateMovies(animeType: string, movies: Movie[]) {
    if (animeType === 'serie' && movies.length > 0) {
      throw new BusinessRuleError({
        message: 'movies: series cannot have movies',
        field: 'movies',
        rule: 'series_no_movies',
      });
    }

    if (animeType !== 'serie' && movies.length === 0) {
      throw new BusinessRuleError({
        message: 'movies: movies and mixed types must have at least one movie',
        field: 'movies',
        rule: 'requires_movie',
      });
    }
  }

  private static validateCreateSeasons(animeType: string, seasons: Season[]) {
    if (animeType === 'movie' && seasons.length > 0) {
      throw new BusinessRuleError({
        message: 'seasons: movies cannot have seasons',
        field: 'seasons',
        rule: 'movie_no_seasons',
      });
    }

    if (animeType !== 'movie' && seasons.length === 0) {
      throw new BusinessRuleError({
        message: 'seasons: series and mixed types must have at least one season',
        field: 'seasons',
        rule: 'requires_season',
      });
    }
  }

  addMovie(data: { name: string; releaseDate: Date }) {
    const newMovie = Movie.create(data);

    Anime.validateCreateMovies(this._animeType, [newMovie]);
    Anime.ensureUniqueMovies([...this._movies, newMovie]);

    this._movies.push(newMovie);
    this._updatedAt = new Date();
  }

  addSeason(data: { seasonNumber: number; releaseDate: Date; totalEpisodes: number }) {
    const newSeason = Season.create(data);

    Anime.validateCreateSeasons(this._animeType, [newSeason]);
    Anime.ensureUniqueSeasons([...this._seasons, newSeason]);

    this._seasons.push(newSeason);
    this._updatedAt = new Date();
  }

  addGenre(genre: Genre) {
    Anime.ensureUniqueGenres([...this._genres, genre]);

    this._genres.push(genre);
    this._updatedAt = new Date();
  }

  removeMovie(data: { name: string; releaseDate: Date }) {
    const movieIndex = this._movies.findIndex((m) => m.equals(Movie.create(data)));

    if (movieIndex === -1) {
      throw new BusinessRuleError({
        message: 'movie: not found',
        field: 'movie',
        rule: 'not_found',
      });
    }

    const copyMovies = [...this._movies];

    copyMovies.splice(movieIndex, 1);

    if (copyMovies.length === 0 && this._animeType !== 'serie') {
      throw new BusinessRuleError({
        message: 'movies: anime must have at least one movie',
        field: 'movies',
        rule: 'min_movies',
      });
    }

    this._movies = copyMovies;
    this._updatedAt = new Date();
  }

  removeSeason(data: { seasonNumber: number; releaseDate: Date; totalEpisodes: number }) {
    const seasonIndex = this._seasons.findIndex((s) => s.equals(Season.create(data)));

    if (seasonIndex === -1) {
      throw new BusinessRuleError({
        message: 'season: not found',
        field: 'season',
        rule: 'not_found',
      });
    }

    const copySeasons = [...this._seasons];

    copySeasons.splice(seasonIndex, 1);

    if (copySeasons.length === 0 && this._animeType !== 'movie') {
      throw new BusinessRuleError({
        message: 'seasons: anime must have at least one season',
        field: 'seasons',
        rule: 'min_seasons',
      });
    }

    this._seasons = copySeasons;
    this._updatedAt = new Date();
  }

  removeGenre(genreId: Id) {
    const genreIndex = this._genres.findIndex((g) => g.id.equals(genreId));

    if (genreIndex === -1) {
      throw new BusinessRuleError({
        message: 'genre: not found',
        field: 'genre',
        rule: 'not_found',
      });
    }

    const copyGenres = [...this._genres];

    copyGenres.splice(genreIndex, 1);

    if (copyGenres.length === 0) {
      throw new BusinessRuleError({
        message: 'genres: anime must have at least one genre',
        field: 'genres',
        rule: 'min_genres',
      });
    }

    this._genres = copyGenres;
    this._updatedAt = new Date();
  }

  updateCommonInfo(data: {
    name?: string;
    synopsis?: string;
    category?: Category;
    animeType?: string;
    productionType?: string;
    isAdultContent?: boolean;
  }) {
    if (data.synopsis !== undefined && typeof data.synopsis !== 'string') {
      throw new InvalidValueError({
        message: 'synopsis: must be a string',
        field: 'synopsis',
      });
    }

    if (data.animeType !== undefined && typeof data.animeType !== 'string') {
      throw new InvalidValueError({
        message: 'animeType: must be a string',
        field: 'animeType',
      });
    }

    if (data.productionType !== undefined && typeof data.productionType !== 'string') {
      throw new InvalidValueError({
        message: 'productionType: must be a string',
        field: 'productionType',
      });
    }

    data.name !== undefined && (this._name = Name.create(data.name));
    data.category !== undefined && (this._category = data.category);
    data.synopsis !== undefined && (this._synopsis = Description.create(data.synopsis));

    if (data.isAdultContent !== undefined) {
      Anime.validateBooleanFields(data.isAdultContent, 'Adult content flag');

      this._isAdultContent = data.isAdultContent;
    }

    if (data.animeType !== undefined || data.productionType !== undefined) {
      const normalizedAnimeType = data.animeType
        ? data.animeType.toLowerCase().trim()
        : this._animeType;
      const normalizedProductionType = data.productionType
        ? data.productionType.toLowerCase().trim()
        : this._productionType;

      Anime.validateEnumFields(normalizedAnimeType, normalizedProductionType);

      this._animeType = normalizedAnimeType as AnimeType;
      this._productionType = normalizedProductionType as ProductionType;
    }

    const hasAnyProp = Object.keys(data).some((k) => (data as any)[k] !== undefined);

    if (hasAnyProp) this._updatedAt = new Date();
  }

  updateImageUrl(newImageUrl: string) {
    this._imageUrl = Url.create(newImageUrl);
    this._updatedAt = new Date();
  }

  static toDomain(data: {
    id: string;
    imageUrl: string;
    name: string;
    synopsis: string;
    category: Category;
    genres: Genre[];
    animeType: AnimeType;
    productionType: ProductionType;
    movies: Movie[];
    seasons: Season[];
    isAdultContent: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new Anime({
      id: Id.create(data.id),
      imageUrl: Url.create(data.imageUrl),
      name: Name.create(data.name),
      synopsis: Description.create(data.synopsis),
      category: data.category,
      genres: data.genres,
      animeType: data.animeType,
      productionType: data.productionType,
      movies: data.movies,
      seasons: data.seasons,
      isAdultContent: data.isAdultContent,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  equals(other: Anime) {
    return this._id.equals(other._id);
  }
}

export default Anime;
