import About from "../values-objects/about.js";
import Id from "../values-objects/id.js";
import Name from "../values-objects/name.js";
import Url from "../values-objects/url.js";
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
  synopsis: About;
  coverUrl: Url;
  releaseDate: Date;
  category: Category;
  genres: Genre[];
  typeOfAnime: TypeOfAnime;
  typeOfProduction: TypeOfProduction;
  typeOfSourceMaterial: TypeOfSourceMaterial;
  isAdultContent: boolean;
  totalSeasons: number;
  totalEpisodes: number;
  movies: {
    list: Name[];
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

class Anime {
  private readonly _id: Id;
  private _title: Name;
  private _synopsis: About;
  private _coverUrl: Url;
  private _releaseDate: Date;
  private _category: Category;
  private _genres: Genre[];
  private _typeOfAnime: TypeOfAnime;
  private _typeOfProduction: TypeOfProduction;
  private _typeOfSourceMaterial: TypeOfSourceMaterial;
  private _isAdultContent: boolean;
  private _totalSeasons: number;
  private _totalEpisodes: number;
  private _movies: {
    list: Name[];
    updatedAt: Date;
  };
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
    this._totalSeasons = props.totalSeasons;
    this._totalEpisodes = props.totalEpisodes;
    this._movies = props.movies;
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

  get totalSeasons() {
    return this._totalSeasons;
  }

  get totalEpisodes() {
    return this._totalEpisodes;
  }

  get movies() {
    return this._movies;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  static create(data: {
    title: string;
    synopsis: string;
    coverUrl: string;
    releaseDate: string;
    category: Category;
    genres: Genre[];
    typeOfAnime: string;
    typeOfProduction: string;
    typeOfSourceMaterial: string;
    isAdultContent: boolean;
    totalSeasons: number;
    totalEpisodes: number;
    movies: string[];
  }) {
    this.validateDate(data.releaseDate);
    this.validateTypeOfAnime(data.typeOfAnime);
    this.validateTypeOfProduction(data.typeOfProduction);
    this.validateTypeOfSourceMaterial(data.typeOfSourceMaterial);
    this.validateIsNumber(data.totalSeasons, "totalSeasons");
    this.validateIsNumber(data.totalEpisodes, "totalEpisodes");

    const id = Id.generateRandom();
    const title = Name.create(data.title, true);
    const synopsis = About.create(data.synopsis);
    const coverUrl = Url.create(data.coverUrl);
    const releaseDate = new Date(data.releaseDate);
    const category = data.category;
    const genres = data.genres;
    const typeOfAnime = data.typeOfAnime as TypeOfAnime;
    const typeOfProduction = data.typeOfProduction as TypeOfProduction;
    const typeOfSourceMaterial =
      data.typeOfSourceMaterial as TypeOfSourceMaterial;
    const isAdultContent = data.isAdultContent;
    const totalSeasons = data.totalSeasons;
    const totalEpisodes = data.totalEpisodes;
    const movies = {
      list: data.movies.map((movieTitle) => Name.create(movieTitle, true)),
      updatedAt: new Date(),
    };
    const createdAt = new Date();
    const updatedAt = new Date();

    return new Anime({
      id,
      title,
      synopsis,
      coverUrl,
      releaseDate,
      category,
      genres,
      typeOfAnime,
      typeOfProduction,
      typeOfSourceMaterial,
      isAdultContent,
      totalSeasons,
      totalEpisodes,
      movies,
      createdAt,
      updatedAt,
    });
  }

  static toDomain(raw: {
    _id: string;
    title: string;
    synopsis: string;
    coverUrl: string;
    releaseDate: Date;
    category: Category;
    genres: Genre[];
    typeOfAnime: string;
    typeOfProduction: string;
    typeOfSourceMaterial: string;
    isAdultContent: boolean;
    totalSeasons: number;
    totalEpisodes: number;
    movies: {
      list: string[];
      updatedAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new Anime({
      id: Id.create(raw._id),
      title: Name.create(raw.title, true),
      synopsis: About.create(raw.synopsis, true),
      coverUrl: Url.create(raw.coverUrl),
      releaseDate: raw.releaseDate,
      category: raw.category,
      genres: raw.genres,
      typeOfAnime: raw.typeOfAnime as TypeOfAnime,
      typeOfProduction: raw.typeOfProduction as TypeOfProduction,
      typeOfSourceMaterial: raw.typeOfSourceMaterial as TypeOfSourceMaterial,
      isAdultContent: raw.isAdultContent,
      totalSeasons: raw.totalSeasons,
      totalEpisodes: raw.totalEpisodes,
      movies: {
        list: raw.movies.list.map((movieTitle) =>
          Name.create(movieTitle, true),
        ),
        updatedAt: raw.movies.updatedAt,
      },
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  private static validateDate(date: string) {
    const parsedDate = Date.parse(date);

    if (isNaN(parsedDate)) {
      throw new Error("Invalid date format. Expected format: YYYY-MM-DD");
    }
  }

  private static validateTypeOfAnime(typeOfAnime: string) {
    const validTypes: TypeOfAnime[] = ["serie", "movie", "mixed"];

    if (!validTypes.includes(typeOfAnime as TypeOfAnime)) {
      throw new Error(
        `Invalid type of anime. Valid types are: ${validTypes.join(", ")}`,
      );
    }
  }

  private static validateTypeOfProduction(typeOfProduction: string) {
    const validTypes: TypeOfProduction[] = ["original", "adaptation"];

    if (!validTypes.includes(typeOfProduction as TypeOfProduction)) {
      throw new Error(
        `Invalid type of production. Valid types are: ${validTypes.join(", ")}`,
      );
    }
  }

  private static validateTypeOfSourceMaterial(typeOfSourceMaterial: string) {
    const validTypes: TypeOfSourceMaterial[] = [
      "manga",
      "manhwa",
      "donghua",
      "light_novel",
      "game",
      "other",
      "none",
    ];

    if (!validTypes.includes(typeOfSourceMaterial as TypeOfSourceMaterial)) {
      throw new Error(
        `Invalid type of source material. Valid types are: ${validTypes.join(", ")}`,
      );
    }
  }

  private static validateIsNumber(value: any, fieldName: string) {
    if (typeof value !== "number" || isNaN(value)) {
      throw new Error(`Invalid value for ${fieldName}. Expected a number.`);
    }
  }

  private static validateNoDuplicates(movies: Name[]) {
    const seen = new Set<string>();

    for (const movie of movies) {
      const movieTitle = movie.value;

      if (seen.has(movieTitle)) {
        throw new Error(
          `Duplicate movie title found: "${movieTitle}". Each movie title must be unique.`,
        );
      }

      seen.add(movieTitle);
    }
  }

  updateCommonInfo(data: {
    title?: string;
    synopsis?: string;
    coverUrl?: string;
    releaseDate?: string;
    category?: Category;
    genres?: Genre[];
    typeOfAnime?: string;
    typeOfProduction?: string;
    typeOfSourceMaterial?: string;
    isAdultContent?: boolean;
  }) {
    if (Object.keys(data).length === 0) {
      throw new Error("At least one field must be provided for update.");
    }

    if (data.title) {
      this._title = Name.create(data.title, true);
    }

    if (data.synopsis) {
      this._synopsis = About.create(data.synopsis);
    }

    if (data.coverUrl) {
      this._coverUrl = Url.create(data.coverUrl);
    }

    if (data.releaseDate) {
      Anime.validateDate(data.releaseDate);
      this._releaseDate = new Date(data.releaseDate);
    }

    if (data.category) {
      this._category = data.category;
    }

    if (data.genres) {
      this._genres = data.genres;
    }

    if (data.typeOfAnime) {
      Anime.validateTypeOfAnime(data.typeOfAnime);
      this._typeOfAnime = data.typeOfAnime as TypeOfAnime;
    }

    if (data.typeOfProduction) {
      Anime.validateTypeOfProduction(data.typeOfProduction);
      this._typeOfProduction = data.typeOfProduction as TypeOfProduction;
    }

    if (data.typeOfSourceMaterial) {
      Anime.validateTypeOfSourceMaterial(data.typeOfSourceMaterial);
      this._typeOfSourceMaterial =
        data.typeOfSourceMaterial as TypeOfSourceMaterial;
    }

    if (data.isAdultContent !== undefined) {
      this._isAdultContent = data.isAdultContent;
    }

    this._updatedAt = new Date();
  }

  updateSeasonOrEpisodeInfo(data: {
    totalSeasons?: number;
    totalEpisodes?: number;
  }) {
    if (Object.keys(data).length === 0) {
      throw new Error("At least one field must be provided for update.");
    }

    if (this.typeOfAnime === "movie") {
      throw new Error("Cannot update seasons or episodes for a movie.");
    }

    if (data.totalSeasons !== undefined) {
      Anime.validateIsNumber(data.totalSeasons, "totalSeasons");
      this._totalSeasons = data.totalSeasons;
    }

    if (data.totalEpisodes !== undefined) {
      Anime.validateIsNumber(data.totalEpisodes, "totalEpisodes");
      this._totalEpisodes = data.totalEpisodes;
    }

    this._updatedAt = new Date();
  }

  updateMovies(movies: string[]) {
    if (this.typeOfAnime === "serie") {
      throw new Error("Cannot update movies for a serie.");
    }

    const currentMovieTitles = this._movies.list;
    const newMovieTitles = movies.map((movieTitle) =>
      Name.create(movieTitle, true),
    );

    Anime.validateNoDuplicates(newMovieTitles);

    const hasChanges =
      currentMovieTitles.length !== newMovieTitles.length ||
      currentMovieTitles.some(
        (currentTitle, index) => !currentTitle.equals(newMovieTitles[index]),
      );

    if (!hasChanges) {
      throw new Error("No changes detected in the movies list.");
    }

    this._movies = {
      list: movies.map((movieTitle) => Name.create(movieTitle, true)),
      updatedAt: new Date(),
    };

    this._updatedAt = new Date();
  }

  equals(other: Anime) {
    return this._id.equals(other.id);
  }
}

export default Anime;
