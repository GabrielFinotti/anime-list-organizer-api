export interface IAnime {
  id: string;
  name: string;
  synopsis: string;
  category: string;
  genres: string[];
  isMovie: boolean;
  isSerieContentAnyMovie: boolean;
  moviesNames: string[];
  releaseDate: Date;
  typeOfOriginMaterial: string;
  originMaterialName: string;
  lastReleaseSeason: number | null;
  lastWatchSeason: number | null;
  lastWatchedEpisode: number | null;
  status: "watching" | "completed" | "dropped" | "in list";
  createdAt: Date;
  updatedAt: Date;
}

class Anime implements IAnime {
  declare id: string;
  declare name: string;
  declare synopsis: string;
  declare category: string;
  declare genres: string[];
  declare isMovie: boolean;
  declare isSerieContentAnyMovie: boolean;
  declare moviesNames: string[];
  declare releaseDate: Date;
  declare typeOfOriginMaterial: string;
  declare originMaterialName: string;
  declare lastReleaseSeason: number | null;
  declare lastWatchSeason: number | null;
  declare lastWatchedEpisode: number | null;
  declare status: "watching" | "completed" | "dropped" | "in list";
  declare createdAt: Date;
  declare updatedAt: Date;

  constructor(props: IAnime) {
    this.id = props.id;
    this.name = props.name;
    this.synopsis = props.synopsis;
    this.category = props.category;
    this.genres = props.genres;
    this.isMovie = props.isMovie;
    this.isSerieContentAnyMovie = props.isSerieContentAnyMovie;
    this.moviesNames = props.moviesNames;
    this.releaseDate = props.releaseDate;
    this.typeOfOriginMaterial = props.typeOfOriginMaterial;
    this.originMaterialName = props.originMaterialName;
    this.lastReleaseSeason = props.lastReleaseSeason;
    this.lastWatchSeason = props.lastWatchSeason;
    this.lastWatchedEpisode = props.lastWatchedEpisode;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export default Anime;
