import GenreModel from "@/database/model/genre.model";
import { GenreDTO } from "@/interface/dto/genre.dto";
import { IGenreRepository } from "@/interface/repository/genre.repository";

class GenreRepository implements IGenreRepository {
  async create(genre: GenreDTO) {
    try {
      const newGenre = await GenreModel.create(genre);

      const createdGenre: GenreDTO = {
        id: newGenre._id.toString(),
        ...newGenre,
      };

      return createdGenre;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating genre: ${error.message}`);
      }

      throw new Error("Unknown error creating genre");
    }
  }

  async delete(id: string) {
    try {
      const deleted = await GenreModel.findByIdAndDelete(id);

      return !!deleted;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting genre: ${error.message}`);
      }

      throw new Error("Unknown error deleting genre");
    }
  }

  async findByName(name: string) {
    try {
      const genre = await GenreModel.findOne({ name });

      return genre;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error finding genre: ${error.message}`);
      }

      throw new Error("Unknown error finding genre");
    }
  }

  async findAll() {
    try {
      const genres = await GenreModel.find();

      return genres;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error finding genres: ${error.message}`);
      }

      throw new Error("Unknown error finding genres");
    }
  }
}

export default GenreRepository;
