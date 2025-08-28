import Name from "../value-object/name.vo";
import ObjectId from "../value-object/objectId.vo";
import ReleaseDate from "../value-object/releaseDate.vo";
import Synopsis from "../value-object/synopsis.vo";

type Status = "watching" | "completed" | "dropped" | "in list";

class Anime {
  private readonly _id: string;
  private readonly _name: string;
  private _synopsis: string;
  private _category: string;
  private _genres: string[];
  private readonly _typeOfMaterialOrigin: string;
  private readonly _materialOriginName: string;
  private readonly _releaseDate: Date;
  private readonly _isAMovie: boolean;
  private _derivates: {
    movies?: string[];
    ova?: string[];
    specials?: string[];
  } | null;
  private _lastReleaseSeason: number | null;
  private _lastWatchedSeason: number | null;
  private _lastWatchedEpisode: number | null;
  private _status: Status;

  private constructor(
    id: string,
    name: string,
    synopsis: string,
    category: string,
    genres: string[],
    typeOfMaterialOrigin: string,
    materialOriginName: string,
    releaseDate: Date,
    isAMovie: boolean,
    derivates: {
      movies?: string[];
      ova?: string[];
      specials?: string[];
    } | null,
    lastReleaseSeason: number | null,
    lastWatchedSeason: number | null,
    lastWatchedEpisode: number | null,
    status: Status
  ) {
    this._id = ObjectId.create(id).value;
    this._name = Name.create(name).value;
    this._synopsis = Synopsis.create(synopsis).value;
    this._category = ObjectId.create(category).value;
    this._genres = genres.map((genre) => ObjectId.create(genre).value);
    this._typeOfMaterialOrigin = Name.create(typeOfMaterialOrigin).value;
    this._materialOriginName = Name.create(materialOriginName).value;
    this._releaseDate = ReleaseDate.create(releaseDate).value;
    this._isAMovie = isAMovie;
    this._derivates = derivates
      ? {
          movies: derivates.movies?.map((movie) => Name.create(movie).value),
          ova: derivates.ova?.map((ova) => Name.create(ova).value),
          specials: derivates.specials?.map(
            (special) => Name.create(special).value
          ),
        }
      : null;
    this._lastReleaseSeason = lastReleaseSeason;
    this._lastWatchedSeason = lastWatchedSeason;
    this._lastWatchedEpisode = lastWatchedEpisode;
    this._status = status;
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
  get typeOfMaterialOrigin() {
    return this._typeOfMaterialOrigin;
  }
  get materialOriginName() {
    return this._materialOriginName;
  }
  get releaseDate() {
    return this._releaseDate;
  }
  get isAMovie() {
    return this._isAMovie;
  }
  get derivates() {
    return this._derivates ? { ...this._derivates } : null;
  }
  get lastReleaseSeason() {
    return this._lastReleaseSeason;
  }
  get lastWatchedSeason() {
    return this._lastWatchedSeason;
  }
  get lastWatchedEpisode() {
    return this._lastWatchedEpisode;
  }
  get status() {
    return this._status;
  }

  set synopsis(synopsis: string) {
    this._synopsis = Synopsis.create(synopsis).value;
  }
  set category(category: string) {
    this._category = ObjectId.create(category).value;
  }
  set genre(genre: string[]) {
    this._genres.push(...genre.map((g) => ObjectId.create(g).value));
  }
  set derivates(
    derivates: {
      movies?: string[];
      ova?: string[];
      specials?: string[];
    } | null
  ) {
    this._derivates = derivates
      ? {
          movies: derivates.movies?.map((movie) => Name.create(movie).value),
          ova: derivates.ova?.map((ova) => Name.create(ova).value),
          specials: derivates.specials?.map(
            (special) => Name.create(special).value
          ),
        }
      : null;
  }
  set lastReleaseSeason(season: number | null) {
    if (season !== null && season < 0) throw new Error("Temporada inválida");

    this._lastReleaseSeason = season;
  }
  set lastWatchedSeason(season: number | null) {
    if (season !== null && season < 0) throw new Error("Temporada inválida");
    this._lastWatchedSeason = season;
  }
  set lastWatchedEpisode(episode: number | null) {
    if (episode !== null && episode < 0) throw new Error("Episódio inválido");
    this._lastWatchedEpisode = episode;
  }
  set status(status: Status) {
    if (!["watching", "completed", "dropped", "in list"].includes(status)) {
      throw new Error("Status inválido");
    }

    this._status = status;
  }

  static create(
    id: string,
    name: string,
    synopsis: string,
    category: string,
    genres: string[],
    typeOfMaterialOrigin: string,
    materialOriginName: string,
    releaseDate: Date,
    isAMovie: boolean,
    derivates: {
      movies?: string[];
      ova?: string[];
      specials?: string[];
    } | null,
    lastReleaseSeason: number | null,
    lastWatchedSeason: number | null,
    lastWatchedEpisode: number | null,
    status: Status
  ) {
    return new Anime(
      id,
      name,
      synopsis,
      category,
      genres,
      typeOfMaterialOrigin,
      materialOriginName,
      releaseDate,
      isAMovie,
      derivates,
      lastReleaseSeason,
      lastWatchedSeason,
      lastWatchedEpisode,
      status
    );
  }
}

export default Anime;
