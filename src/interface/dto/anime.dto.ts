import { CategoryDTO } from "./category.dto";
import { GenreDTO } from "./genre.dto";

export type AnimeDTO = {
  id?: string;
  name: string;
  synopsis: string;
  category: CategoryDTO;
  genres: GenreDTO[];
  typeOfMaterialOrigin: string;
  materialOriginName: string;
  releaseDate: string;
  isMovie: boolean;
  derivate?: {
    movies: string[];
    ovas: string[];
    specials: string[];
  };
  lastReleaseSeason: number;
  lastWatchedSeason: number;
  lastWatchedEpisode: number;
  status: "watching" | "completed" | "in list" | "dropped";
};
