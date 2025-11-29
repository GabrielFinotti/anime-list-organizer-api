export type MovieStatusDTO = {
  movie: {
    title: string;
    releaseDate: Date;
  };
  status: string;
  isLiked: boolean;
};

export type SeasonStatusDTO = {
  season: {
    seasonNumber: number;
    releaseDate: Date;
    totalEpisodes: number;
  };
  status: string;
  lastEpisodeWatched: number;
  isLiked: boolean;
};

export type AnimeStatusDTO = {
  animeId: string;
  animeName: string;
  status: string;
  moviesStatus: MovieStatusDTO[];
  seasonsStatus: SeasonStatusDTO[];
  isLiked: boolean;
};

export type UserInputDTO = {
  imageUrl: string;
  username: string;
  email: string;
  password: string;
  biography: string;
  role?: 'user' | 'admin';
};

export type UserOutputDTO = {
  id: string;
  imageUrl: string;
  username: string;
  email: string;
  biography: string;
  animeList: {
    list: AnimeStatusDTO[];
    updatedAt: Date;
  };
  favoriteAnimes: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateUserInputDTO = {
  id: string;
  username?: string;
  email?: string;
  password?: string;
  biography?: string;
  imageUrl?: string;
};

export type AddAnimeToListInputDTO = {
  userId: string;
  animeId: string;
};

export type RemoveAnimeFromListInputDTO = {
  userId: string;
  animeId: string;
};

export type ToggleAnimeLikeInputDTO = {
  userId: string;
  animeId: string;
};

export type UpdateMovieStatusInputDTO = {
  userId: string;
  animeId: string;
  movie: {
    name: string;
    releaseDate: Date;
  };
  status: 'watching' | 'finished' | 'in_list';
  isLiked: boolean;
};

export type UpdateSeasonStatusInputDTO = {
  userId: string;
  animeId: string;
  season: {
    seasonNumber: number;
    releaseDate: Date;
    totalEpisodes: number;
  };
  status: 'watching' | 'finished' | 'in_list';
  lastEpisodeWatched: number;
  isLiked: boolean;
};
