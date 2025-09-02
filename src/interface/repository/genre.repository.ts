import { GenreDTO } from "../dto/genre.dto";

export type IGenreRepository = {
  create(genre: Omit<GenreDTO, "id">): Promise<GenreDTO>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<GenreDTO | null>;
  findAll(): Promise<GenreDTO[]>;
};
