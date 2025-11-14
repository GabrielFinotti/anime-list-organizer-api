import Id from '../value-objects/id.value-object.js';
import Movie from '../value-objects/movie.value-object.js';
import Name from '../value-objects/name.value-object.js';
import Season from '../value-objects/season.value-object.js';
import Category from './Category.entity.js';
import Genre from './Genre.entity.js';

type AnimeType = 'serie' | 'movie' | 'mixed';
type ProductionType = 'original' | 'adaptation';

type AnimeProps = {
  id: Id;
  name: Name;
  synopsis: string;
  category: Category;
  genres: Genre[];
  animeType: AnimeType;
  productionType: ProductionType;
  movies: Movie[] | null;
  seasons: Season[] | null;
  isAdultContent: boolean;
  createdAt: Date;
  updatedAt: Date;
};

class Anime {
  private readonly _id: Id;
  private _name: Name;
  private _synopsis: string;
  private _category: Category;
  private _genres: Genre[];
  private _animeType: AnimeType;
  private _productionType: ProductionType;
  private _movies: Movie[] | null;
  private _seasons: Season[] | null;
  private _isAdultContent: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private static ANIME_TYPES = ['serie', 'movie', 'mixed'];
  private static PRODUCTION_TYPES = ['original', 'adaptation'];

  private constructor(props: AnimeProps) {
    this._id = props.id;
    this._name = props.name;
    this._synopsis = props.synopsis;
    this._category = props.category;
    this._genres = [...props.genres];
    this._animeType = props.animeType;
    this._productionType = props.productionType;
    this._movies = props.movies ? [...props.movies] : null;
    this._seasons = props.seasons ? [...props.seasons] : null;
    this._isAdultContent = props.isAdultContent;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id() {
    return this._id;
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
    return this._movies ? [...this._movies] : null;
  }

  get seasons() {
    return this._seasons ? [...this._seasons] : null;
  }

  get totalSeasons() {
    return this._seasons && this._seasons.length > 0 ? this._seasons.length : null;
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
    name: string;
    synopsis: string;
    category: Category;
    genres: Genre[];
    animeType: string;
    productionType: string;
    movies: Movie[] | null;
    seasons: Season[] | null;
    isAdultContent: boolean;
  }) {
    if (typeof data.animeType !== 'string') throw new Error('Anime type must be a string');
    if (typeof data.synopsis !== 'string') throw new Error('Synopsis must be a string');

    if (data.genres.length === 0) {
      throw new Error('At least one genre must be provided');
    }

    if (typeof data.productionType !== 'string') {
      throw new Error('Production type must be a string');
    }

    const normalizedAnimeType = data.animeType.toLowerCase().trim();
    const normalizedProductionType = data.productionType.toLowerCase().trim();
    const normalizedSynopsis = data.synopsis.trim();

    this.validateSynopsis(normalizedSynopsis);
    this.validateEnumFields(normalizedAnimeType, normalizedProductionType);
    this.validateBooleanFields(data.isAdultContent, 'Adult content flag');
    this.ensureUniqueGenres(data.genres);

    const id = Id.generateRandomId();
    const newName = Name.create(data.name);
    const createdAt = new Date();
    const updatedAt = new Date();

    const moviesInput = data.movies ?? [];
    const hasMovies = this.validateCreateMovies(normalizedAnimeType, moviesInput);

    if (hasMovies && moviesInput.length > 0) {
      this.ensureUniqueMovies(moviesInput);
    }

    const seasonsInput = data.seasons ?? [];
    const hasSeasons = this.validateCreateSeasons(normalizedAnimeType, seasonsInput);

    if (hasSeasons && seasonsInput.length > 0) {
      this.ensureUniqueSeasons(seasonsInput);
    }

    const movies = hasMovies && moviesInput ? moviesInput : null;
    const seasons = hasSeasons && seasonsInput ? seasonsInput : null;

    return new Anime({
      id,
      name: newName,
      synopsis: normalizedSynopsis,
      category: data.category,
      genres: data.genres,
      animeType: normalizedAnimeType as AnimeType,
      productionType: normalizedProductionType as ProductionType,
      movies,
      seasons,
      isAdultContent: data.isAdultContent,
      createdAt,
      updatedAt,
    });
  }

  private static validateSynopsis(synopsis: string) {
    if (synopsis.length < 10) throw new Error('Synopsis must be at least 10 characters long');
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
    const ids = new Set<string>();

    for (const genre of genres) {
      const id = genre.id.value;

      if (ids.has(id)) throw new Error('Duplicate genres detected');

      ids.add(id);
    }
  }

  private static ensureUniqueMovies(movies: Movie[]) {
    const keys = new Set<string>();

    for (const movie of movies) {
      const key = `${movie.title.value}|${movie.releaseDate.getTime()}`;

      if (keys.has(key)) throw new Error('Duplicate movies detected');
      keys.add(key);
    }
  }

  private static ensureUniqueSeasons(seasons: Season[]) {
    const keys = new Set<string>();

    for (const season of seasons) {
      const key = `${season.seasonNumber}|${season.releaseDate.getTime()}`;

      if (keys.has(key)) throw new Error('Duplicate seasons detected');

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

    return animeType !== 'serie' && movies.length > 0;
  }

  private static validateCreateSeasons(animeType: string, seasons: Season[]) {
    if (animeType === 'movie' && seasons.length > 0) {
      throw new Error('Movies cannot have seasons');
    }

    if (animeType !== 'movie' && seasons.length === 0) {
      throw new Error('Series and mixed types must have at least one season');
    }

    return animeType !== 'movie' && seasons.length > 0;
  }
}
export default Anime;
