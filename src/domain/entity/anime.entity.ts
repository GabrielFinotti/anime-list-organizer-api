import IAnime, { Status } from "../interface/anime.interface";
import Name from "../value-object/name.vo";
import ObjectId from "../value-object/objectId.vo";
import ReleaseDate from "../value-object/releaseDate.vo";
import Synopsis from "../value-object/synopsis.vo";

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

  private constructor(data: IAnime) {
    this._id = ObjectId.create(data.id).value;
    this._name = Name.create(data.name).value;
    this._synopsis = Synopsis.create(data.synopsis).value;
    this._category = ObjectId.create(data.category).value;
    this._genres = data.genres.map((genre) => ObjectId.create(genre).value);
    this._typeOfMaterialOrigin = Name.create(data.typeOfMaterialOrigin).value;
    this._materialOriginName = Name.create(data.materialOriginName).value;
    this._releaseDate = ReleaseDate.create(data.releaseDate).value;
    this._isAMovie = data.isAMovie;
    this._derivates = data.derivates
      ? {
          movies: data.derivates.movies?.map(
            (movie) => Name.create(movie).value
          ),
          ova: data.derivates.ova?.map((ova) => Name.create(ova).value),
          specials: data.derivates.specials?.map(
            (special) => Name.create(special).value
          ),
        }
      : null;
    this._lastReleaseSeason = data.lastReleaseSeason;
    this._lastWatchedSeason = data.lastWatchedSeason;
    this._lastWatchedEpisode = data.lastWatchedEpisode;
    this._status = data.status;
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

  static create(data: IAnime) {
    return new Anime(data);
  }
}

export default Anime;
