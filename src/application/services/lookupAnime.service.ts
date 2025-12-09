export type GenreInput = {
  name: string;
  isAdultContent: boolean;
};

type MoviesStructure = {
  title: string;
  releaseDate: Date;
};

type SeasonsStructure = {
  seasonNumber: number;
  releaseDate: Date;
  totalEpisodes: number;
};

export type PromptResponse = {
  anime: {
    name: string;
    synopsis: string;
    category: string;
    genres: string[];
    animeType: 'serie' | 'movie' | 'mixed';
    productionType: 'original' | 'adaptation';
    typeOfMaterialOrigin: 'manga' | 'light_novel' | 'visual_novel' | 'game' | 'other' | 'none';
    movies: MoviesStructure[];
    seasons: SeasonsStructure[];
    isAdultContent: boolean;
  };
  observedDetails: string[];
};

export type ILookupAnimeService = {
  getAnimeData(title: string): Promise<PromptResponse>;
};
