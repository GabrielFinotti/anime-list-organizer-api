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
    list: { id: string; name: string }[];
    updatedAt: Date;
  };
  role: string;
  createdAt: Date;
  updatedAt: Date;
};
