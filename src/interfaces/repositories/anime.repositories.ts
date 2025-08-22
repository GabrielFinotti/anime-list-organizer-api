import { AnimeDocument } from "@/database/models/anime.model";
import { CreateAnimeSchema, UpdateAnimeSchema } from "@/schemas/anime.schema";

export interface IAnimeRepository {
  create(anime: CreateAnimeSchema): Promise<AnimeDocument>;
  update(
    id: string,
    anime: Partial<UpdateAnimeSchema>
  ): Promise<AnimeDocument | null>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<AnimeDocument | null>;
  findAll(): Promise<AnimeDocument[]>;
}
