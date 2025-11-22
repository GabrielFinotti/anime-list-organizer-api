import Description from '../value-objects/description.value-object.js';
import Id from '../value-objects/id.value-object.js';
import Movie from '../value-objects/movie.value-object.js';
import Name from '../value-objects/name.value-object.js';
import Season from '../value-objects/season.value-object.js';
import Url from '../value-objects/url.value-object.js';
import Category from './Category.entity.js';
import Genre from './Genre.entity.js';

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
    if (typeof data.animeType !== 'string') throw new Error('Anime type must be a string');

    if (data.genres.length === 0) {
      throw new Error('At least one genre must be provided');
    }

    if (typeof data.productionType !== 'string') {
      throw new Error('Production type must be a string');
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
    if (typeof field !== 'boolean') throw new Error(`${fieldName} must be a boolean`);
  }

  private static validateEnumFields(animeType: string, productionType: string) {
    if (!Anime.ANIME_TYPES.includes(animeType)) {
      throw new Error(`Anime type must be one of the following: ${Anime.ANIME_TYPES.join(', ')}`);
    }

    if (!Anime.PRODUCTION_TYPES.includes(productionType)) {
      throw new Error(
        `Production type must be one of the following: ${Anime.PRODUCTION_TYPES.join(', ')}`,
      );
    }
  }

  private static ensureUniqueGenres(genres: Genre[]) {
    this.ensureUnique(genres, (g) => g.id.value, 'Duplicate genres detected');
  }

  private static ensureUniqueMovies(movies: Movie[]) {
    this.ensureUnique(
      movies,
      (m) => `${m.title.value}|${m.releaseDate.getTime()}`,
      'Duplicate movies detected',
    );
  }

  private static ensureUniqueSeasons(seasons: Season[]) {
    this.ensureUnique(
      seasons,
      (s) => `${s.seasonNumber}|${s.releaseDate.getTime()}`,
      'Duplicate seasons detected',
    );
  }

  private static ensureUnique<T>(
    items: T[],
    keySelector: (item: T) => string,
    errorMessage: string,
  ) {
    const keys = new Set<string>();

    for (const item of items) {
      const key = keySelector(item);

      if (keys.has(key)) throw new Error(errorMessage);

      keys.add(key);
    }
  }

  private static validateCreateMovies(animeType: string, movies: Movie[]) {
    if (animeType === 'serie' && movies.length > 0) {
      throw new Error('Series cannot have movies');
    }

    if (animeType !== 'serie' && movies.length === 0) {
      throw new Error('Movies and mixed types must have at least one movie');
    }
  }

  private static validateCreateSeasons(animeType: string, seasons: Season[]) {
    if (animeType === 'movie' && seasons.length > 0) {
      throw new Error('Movies cannot have seasons');
    }

    if (animeType !== 'movie' && seasons.length === 0) {
      throw new Error('Series and mixed types must have at least one season');
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
      throw new Error('Movie not found');
    }

    const copyMovies = [...this._movies];

    copyMovies.splice(movieIndex, 1);

    if (copyMovies.length === 0 && this._animeType !== 'serie') {
      throw new Error('Anime must have at least one movie');
    }

    this._movies = copyMovies;
    this._updatedAt = new Date();
  }

  removeSeason(data: { seasonNumber: number; releaseDate: Date; totalEpisodes: number }) {
    const seasonIndex = this._seasons.findIndex((s) => s.equals(Season.create(data)));

    if (seasonIndex === -1) {
      throw new Error('Season not found');
    }

    const copySeasons = [...this._seasons];

    copySeasons.splice(seasonIndex, 1);

    if (copySeasons.length === 0 && this._animeType !== 'movie') {
      throw new Error('Anime must have at least one season');
    }

    this._seasons = copySeasons;
    this._updatedAt = new Date();
  }

  removeGenre(genreId: Id) {
    const genreIndex = this._genres.findIndex((g) => g.id.equals(genreId));

    if (genreIndex === -1) {
      throw new Error('Genre not found');
    }

    const copyGenres = [...this._genres];

    copyGenres.splice(genreIndex, 1);

    if (copyGenres.length === 0) {
      throw new Error('Anime must have at least one genre');
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
      throw new Error('Synopsis must be a string');
    }

    if (data.animeType !== undefined && typeof data.animeType !== 'string') {
      throw new Error('Anime type must be a string');
    }

    if (data.productionType !== undefined && typeof data.productionType !== 'string') {
      throw new Error('Production type must be a string');
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

  equals(other: Anime) {
    return this._id.equals(other._id);
  }
}

export default Anime;
