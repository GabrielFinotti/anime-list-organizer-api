import { CreateAnimeSchema, UpdateAnimeSchema } from "@/schemas/anime.schema";
import { AnimeDTO } from "../dto/anime.dto";

export interface IAnimeRepository {
  create(anime: CreateAnimeSchema): Promise<AnimeDTO>;
  update(id: string, anime: UpdateAnimeSchema): Promise<AnimeDTO | null>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<AnimeDTO | null>;
  findAll(): Promise<AnimeDTO[]>;
}
