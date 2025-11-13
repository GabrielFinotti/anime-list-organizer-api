import Id from '../value-objects/id.value-object.js';
import Movie from '../value-objects/movie.value-object.js';
import Name from '../value-objects/name.value-object.js';
import Season from '../value-objects/season.value-object.js';
import Category from './Category.entity.js';
import Genre from './Genre.entity.js';

type AnimeProps = {
  id: Id;
  name: Name;
  sinopsis: string;
  category: Category;
  genres: Genre[];
  animeType: 'serie' | 'movie' | 'mixed';
  productionType: 'original' | 'adaptation';
  movies: Movie[] | null;
  seasons: Season[] | null;
  totalSeasons: number | null;
  isAdultContent: boolean;
  createdAt: Date;
  updatedAt: Date;
};

class Anime {
  private readonly _id: Id;
  private _name: Name;
  private _sinopsis: string;
  private _category: Category;
  private _genres: Genre[];
  private _animeType: 'serie' | 'movie' | 'mixed';
  private _productionType: 'original' | 'adaptation';
  private _movies: Movie[] | null;
  private _seasons: Season[] | null;
  private _totalSeasons: number | null;
  private _isAdultContent: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: AnimeProps) {
    this._id = props.id;
    this._name = props.name;
    this._sinopsis = props.sinopsis;
    this._category = props.category;
    this._genres = props.genres;
    this._animeType = props.animeType;
    this._productionType = props.productionType;
    this._movies = props.movies;
    this._seasons = props.seasons;
    this._totalSeasons = props.totalSeasons;
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

  get sinopsis() {
    return this._sinopsis;
  }

  get category() {
    return this._category;
  }

  get genres() {
    return this._genres;
  }

  get animeType() {
    return this._animeType;
  }

  get productionType() {
    return this._productionType;
  }

  get movies() {
    return this._movies;
  }

  get seasons() {
    return this._seasons;
  }

  get totalSeasons() {
    return this._totalSeasons;
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
}

export default Anime;
