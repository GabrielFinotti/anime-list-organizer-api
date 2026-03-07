import Anime from "../entity/Anime.js";

export interface IAnimeRepository {
  findById(id: string): Promise<Anime | null>;
  findByTitle(title: string): Promise<Anime | null>;
  findAll(): Promise<Anime[]>;
  create(anime: Anime): Promise<void>;
  update(anime: Anime): Promise<Anime>;
  delete(id: string): Promise<void>;
}
