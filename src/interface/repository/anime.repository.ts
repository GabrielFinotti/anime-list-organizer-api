import { AnimeDTO } from "../dto/anime.dto";

export type IAnimeRepository = {
  create(anime: AnimeDTO): Promise<AnimeDTO>;
  update(anime: Partial<AnimeDTO>): Promise<AnimeDTO | null>;
  delete(id: string): Promise<boolean>;
  deleteAll(): Promise<boolean>;
  findByQuery(
    name: string,
    category: string,
    genre: string
  ): Promise<AnimeDTO[]>;
  findById(id: string): Promise<AnimeDTO | null>;
  findByCategory(category: string): Promise<AnimeDTO[]>;
  findByGenre(genre: string): Promise<AnimeDTO[]>;
};
