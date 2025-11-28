export type MovieDTO = {
  title: string;
  releaseDate: Date;
};

export type SeasonDTO = {
  seasonNumber: number;
  releaseDate: Date;
  totalEpisodes: number;
};

export type AnimeInputDTO = {
  imageUrl: string;
  name: string;
  synopsis: string;
  categoryId: string;
  genreIds: string[];
  animeType: string;
  productionType: string;
  movies: { name: string; releaseDate: Date }[];
  seasons: { seasonNumber: number; releaseDate: Date; totalEpisodes: number }[];
  isAdultContent: boolean;
};

export type AnimeOutputDTO = {
  id: string;
  imageUrl: string;
  name: string;
  synopsis: string;
  category: {
    id: string;
    name: string;
  };
  genres: {
    id: string;
    name: string;
  }[];
  animeType: string;
  productionType: string;
  movies: MovieDTO[];
  seasons: SeasonDTO[];
  isAdultContent: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// ============================================
// INPUT DTOs para Use Cases
// ============================================

export type UpdateAnimeInputDTO = {
  id: string;
  name?: string;
  synopsis?: string;
  categoryId?: string;
  animeType?: string;
  productionType?: string;
  isAdultContent?: boolean;
  imageUrl?: string;
};

export type AddMovieInputDTO = {
  animeId: string;
  name: string;
  releaseDate: Date;
};

export type AddSeasonInputDTO = {
  animeId: string;
  seasonNumber: number;
  releaseDate: Date;
  totalEpisodes: number;
};

export type AddGenreToAnimeInputDTO = {
  animeId: string;
  genreId: string;
};

export type RemoveMovieInputDTO = {
  animeId: string;
  name: string;
  releaseDate: Date;
};

export type RemoveSeasonInputDTO = {
  animeId: string;
  seasonNumber: number;
  releaseDate: Date;
  totalEpisodes: number;
};

export type RemoveGenreFromAnimeInputDTO = {
  animeId: string;
  genreId: string;
};
