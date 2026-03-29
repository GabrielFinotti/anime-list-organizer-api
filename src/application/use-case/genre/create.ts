import Genre from "../../../domain/entity/Genre.js";
import { IGenreRepository } from "../../../domain/repository/genre.js";
import { GenreInputDTO } from "../../dto/genre.js";
import GenreApplicationMapper from "../../mapper/genre.js";

class CreateGenreUseCase {
  constructor(private readonly genreRepository: IGenreRepository) {}

  async execute(input: GenreInputDTO) {
    const existingGenre = await this.genreRepository.findByName(input.name);

    if (existingGenre) {
      throw new Error("Genre already exists");
    }

    const genre = Genre.create({
      name: input.name,
      description: input.description,
      isAdultGenre: input.isAdultGenre,
    });

    await this.genreRepository.create(genre);

    return GenreApplicationMapper.toResponse(genre);
  }
}

export default CreateGenreUseCase;
