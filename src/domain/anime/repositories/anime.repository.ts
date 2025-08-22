import { CreateAnimeDto, UpdateAnimeDto } from "@/application/dtos/anime.dto";
import Anime from "../entity/anime.entity";

export type IAnimeRepository = {
  create: (data: CreateAnimeDto) => Promise<Anime>;
  update: (id: string, data: UpdateAnimeDto) => Promise<Anime>;
  delete: (id: string) => Promise<boolean>;
  findById: (id: string) => Promise<Anime>;
  findAll: () => Promise<Anime[]>;
};
