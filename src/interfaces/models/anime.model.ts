import { Document } from "mongoose";

export interface IAnime extends Document {
  title: string;
  synopsis: string;
  category: string;
  genres: string[];
  typeOfMaterialOrigin: string;
  materialOriginName: string;
  releaseDate: Date;
  isAMovie: boolean;
  isSerieContentAnyDerivativeMovie: boolean;
  isSerieContentAnyDerivativeOva: boolean;
  isSerieContentAnyDerivativeSpecial: boolean;
  moviesOrOvasOrSpecialsNames: string[] | null;
  lastReleaseSeason: number | null;
  lastWatchedSeason: number | null;
  lastWatchedEpisode: number | null;
}
