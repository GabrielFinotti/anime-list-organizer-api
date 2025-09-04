import { GenreDTO } from "@/interface/dto/genre.dto";
import GenreRepository from "@/repository/genre.repository";

class GenreService {
  constructor(private genreRepository = new GenreRepository()) {}

  async createGenre(genre: GenreDTO) {
    try {
      const existingGenre = await this.genreRepository.findByName(genre.name);

      if (existingGenre) {
        return null;
      }

      const createdGenre = await this.genreRepository.create(genre);

      return createdGenre;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error creating genre");
    }
  }

  async deleteGenre(id: string) {
    try {
      return await this.genreRepository.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error deleting genre");
    }
  }

  async getAllGenres() {
    try {
      const genres = await this.genreRepository.findAll();

      if (genres.length === 0) {
        return null;
      }

      return genres;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error getting all genres");
    }
  }
}

export default new GenreService();
