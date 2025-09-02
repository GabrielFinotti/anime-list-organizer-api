import { GenreDTO } from "../dto/genre.dto";

export type IGenreRepository = {
  create(genre: GenreDTO): Promise<GenreDTO>;
  delete(id: string): Promise<boolean>;
  findByName(id: string): Promise<GenreDTO | null>;
  findAll(): Promise<GenreDTO[]>;
};
