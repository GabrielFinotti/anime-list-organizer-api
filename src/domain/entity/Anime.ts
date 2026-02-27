import Id from "../values-objects/id.js";
import Name from "../values-objects/name.js";
import Category from "./Category.js";
import Genre from "./Genre.js";

type TypeOfAnime = "serie" | "movie" | "mixed";
type TypeOfProduction = "original" | "adaptation";
type TypeOfSourceMaterial =
  | "manga"
  | "manhwa"
  | "donghua"
  | "light_novel"
  | "game"
  | "other"
  | "none";

type AnimeProps = {
  id: Id;
  title: Name;
  synopsis: string;
  coverUrl: string;
  releaseDate: Date;
  category: Category;
  genres: Genre[];
  typeOfAnime: TypeOfAnime;
  typeOfProduction: TypeOfProduction;
  typeOfSourceMaterial: TypeOfSourceMaterial;
  isAdultContent: boolean;
  season: {
    seasonNumber: number;
    episodes: number;
  }[];
  movies: string[];
  createdAt: Date;
  updatedAt: Date;
};

class Anime {
  private readonly _id: Id;
  private _title: Name;
  private _synopsis: string;
  private _coverUrl: string;
  private _releaseDate: Date;
  private _category: Category;
  private _genres: Genre[];
  private _typeOfAnime: TypeOfAnime;
  private _typeOfProduction: TypeOfProduction;
  private _typeOfSourceMaterial: TypeOfSourceMaterial;
  private _isAdultContent: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: AnimeProps) {
    this._id = props.id;
    this._title = props.title;
    this._synopsis = props.synopsis;
    this._coverUrl = props.coverUrl;
    this._releaseDate = props.releaseDate;
    this._category = props.category;
    this._genres = props.genres;
    this._typeOfAnime = props.typeOfAnime;
    this._typeOfProduction = props.typeOfProduction;
    this._typeOfSourceMaterial = props.typeOfSourceMaterial;
    this._isAdultContent = props.isAdultContent;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get synopsis() {
    return this._synopsis;
  }

  get coverUrl() {
    return this._coverUrl;
  }

  get releaseDate() {
    return this._releaseDate;
  }

  get category() {
    return this._category;
  }

  get genres() {
    return this._genres;
  }

  get typeOfAnime() {
    return this._typeOfAnime;
  }

  get typeOfProduction() {
    return this._typeOfProduction;
  }

  get typeOfSourceMaterial() {
    return this._typeOfSourceMaterial;
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
