export interface AnimeDTO {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}
