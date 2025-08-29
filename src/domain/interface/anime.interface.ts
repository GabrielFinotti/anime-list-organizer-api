export type Status = "watching" | "completed" | "dropped" | "in list";

type IAnime = {
  id: string;
  name: string;
  synopsis: string;
  category: string;
  genres: string[];
  typeOfMaterialOrigin: string;
  materialOriginName: string;
  releaseDate: Date;
  isAMovie: boolean;
  derivates: {
    movies?: string[];
    ova?: string[];
    specials?: string[];
  } | null;
  lastReleaseSeason: number | null;
  lastWatchedSeason: number | null;
  lastWatchedEpisode: number | null;
  status: Status;
};

export default IAnime;
