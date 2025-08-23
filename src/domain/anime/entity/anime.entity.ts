export type IAnime = {
  _id: string;
  name: string;
  synopsis: string;
  category: string;
  genres: string[];
  typeOfMaterialOrigin: string;
  materialOriginName: string;
  releaseDate: Date;
  isAMovie: boolean;
  derivates: {
    movies: string[];
    ova: string[];
    specials: string[];
  } | null;
  lastReleaseSeason: number | null;
  lastWatchedSeason: number | null;
  lastWatchedEpisode: number | null;
  status: "watching" | "completed" | "dropped" | "in list";
  createdAt: Date;
  updatedAt: Date;
};

class Anime implements IAnime {
  _id: string;
  name: string;
  synopsis: string;
  category: string;
  genres: string[];
  typeOfMaterialOrigin: string;
  materialOriginName: string;
  releaseDate: Date;
  isAMovie: boolean;
  derivates: {
    movies: string[];
    ova: string[];
    specials: string[];
  } | null;
  lastReleaseSeason: number | null;
  lastWatchedSeason: number | null;
  lastWatchedEpisode: number | null;
  status: "watching" | "completed" | "dropped" | "in list";
  createdAt: Date;
  updatedAt: Date;

  constructor(props: IAnime) {
    this._id = props._id.toString();
    this.name = props.name;
    this.synopsis = props.synopsis;
    this.category = props.category;
    this.genres = props.genres;
    this.typeOfMaterialOrigin = props.typeOfMaterialOrigin;
    this.materialOriginName = props.materialOriginName;
    this.releaseDate = props.releaseDate;
    this.isAMovie = props.isAMovie;
    this.derivates = props.derivates;
    this.lastReleaseSeason = props.lastReleaseSeason;
    this.lastWatchedSeason = props.lastWatchedSeason;
    this.lastWatchedEpisode = props.lastWatchedEpisode;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export default Anime;
