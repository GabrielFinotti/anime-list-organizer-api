import { IGenreRepository } from "../../../domain/repository/genre.js";
import GenreApplicationMapper from "../../mapper/genre.js";

class GetAllGenresUseCase {
  constructor(private readonly genreRepository: IGenreRepository) {}

  async execute() {
    const genres = await this.genreRepository.findAll();

    return genres.map(GenreApplicationMapper.toResponse);
  }
}

export default GetAllGenresUseCase;
