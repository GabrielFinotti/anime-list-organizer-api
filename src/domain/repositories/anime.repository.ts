import Anime from '../entities/Anime.entity.js';

export type IAnimeRepository = {
  findById(id: string): Promise<Anime | null>;
  findByTitle(title: string): Promise<Anime | null>;
  findAll(): Promise<Anime[]>;
  create(anime: Anime): Promise<Anime>;
  update(anime: Anime): Promise<Anime>;
  delete(id: string): Promise<void>;
};
