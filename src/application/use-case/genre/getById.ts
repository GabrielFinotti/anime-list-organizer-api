import { IGenreRepository } from "../../../domain/repository/genre.js";
import GenreApplicationMapper from "../../mapper/genre.js";

class GetGenreUseCase {
  constructor(private readonly genreRepository: IGenreRepository) {}

  async execute(id: string) {
    const genre = await this.genreRepository.findById(id);

    if (!genre) {
      throw new Error("Genre not found");
    }

    return GenreApplicationMapper.toResponse(genre);
  }
}

export default GetGenreUseCase;
