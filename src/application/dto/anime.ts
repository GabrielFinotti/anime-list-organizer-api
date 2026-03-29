export type AnimeInputDTO = {
    title: string;
    synopsis: string;
    coverUrl: string;
    releaseDate: Date;
    category: string[];
    genre: string[];
    typeOfAnime: string;
    typeOfProduction: string;
    typeOfSourceMaterial: string;
    isAdultContent: boolean;
    totalSeasons: number;
    totalEpisodes: number;
    movies: string[];
}

export type UpdateAnimeCommonInfoDTO = {
    title?: string;
    synopsis?: string;
    coverUrl?: string;
    releaseDate?: string;
    categoryId?: string;
    genreIds?: string[];
    typeOfAnime?: string;
    typeOfProduction?: string;
    typeOfSourceMaterial?: string;
    isAdultContent?: boolean;
}

export type UpdateAnimeSeasonOrEpisodeInfoDTO = {
    totalSeasons?: number;
    totalEpisodes?: number;
}

export type UpdateAnimeMoviesDTO = {
    movies: string[];
}