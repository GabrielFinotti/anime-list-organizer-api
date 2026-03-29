import { IGenreRepository } from "../../../domain/repository/genre.js";

class DeleteGenreUseCase {
  constructor(private readonly genreRepository: IGenreRepository) {}

  async execute(id: string) {
    const genre = await this.genreRepository.findById(id);

    if (!genre) {
      throw new Error("Genre not found");
    }

    await this.genreRepository.delete(id);
  }
}

export default DeleteGenreUseCase;
