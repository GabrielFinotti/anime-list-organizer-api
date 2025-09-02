import { DerivateDTO } from "./derivate.dto";

export type AnimeDTO = {
  id: string;
  name: string;
  synopsis: string;
  category: string;
  genres: string[];
  typeOfMaterialOrigin: string;
  materialOriginName: string;
  releaseDate: string;
  isMovie: boolean;
  derivate: DerivateDTO | "";
  lastReleaseSeason: number;
  lastWatchedSeason: number;
  lastWatchedEpisode: number;
  status: "watching" | "completed" | "in list" | "dropped";
};
