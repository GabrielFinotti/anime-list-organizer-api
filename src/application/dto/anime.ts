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