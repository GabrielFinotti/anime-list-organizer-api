import Genre from '../entities/Genre.entity.js';

export type IGenreRepository = {
  findById(id: string): Promise<Genre | null>;
  findByName(name: string): Promise<Genre | null>;
  findAll(): Promise<Genre[]>;
  create(genre: Genre): Promise<void>;
  delete(id: string): Promise<void>;
};
