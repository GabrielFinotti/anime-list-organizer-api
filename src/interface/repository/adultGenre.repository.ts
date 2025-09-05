import { AdultGenreDTO } from "../dto/adultGenre.dto";

export type IAdultGenreRepository = {
  create(adultGenre: AdultGenreDTO): Promise<AdultGenreDTO>;
  delete(id: string): Promise<boolean>;
  findByName(name: string): Promise<AdultGenreDTO | null>;
  findAll(): Promise<AdultGenreDTO[]>;
};
