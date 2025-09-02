import { CategoryDTO } from "./category.dto";
import { DerivateDTO } from "./derivate.dto";
import { GenreDTO } from "./genre.dto";

export type AnimeDTO = {
  id: string;
  name: string;
  synopsis: string;
  category: CategoryDTO;
  genres: GenreDTO[];
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
