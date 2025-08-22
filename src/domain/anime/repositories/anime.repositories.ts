import Anime from "@/domain/anime/entity/anime.entity";
import {
  CreateAnimeSchema,
  UpdateAnimeSchema,
} from "@/domain/anime/schemas/anime.schema";

export interface IAnimeRepository {
  create(data: CreateAnimeSchema): Promise<Anime>;
  update(id: string, data: UpdateAnimeSchema): Promise<Anime>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Anime | null>;
  findAll(): Promise<Anime[]>;
}
