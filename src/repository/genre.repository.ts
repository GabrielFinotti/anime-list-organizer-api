import GenreModel from "@/database/model/genre.model";
import { GenreDTO } from "@/interface/dto/genre.dto";
import { IGenreRepository } from "@/interface/repository/genre.repository";

class GenreRepository implements IGenreRepository {
  async create(genre: GenreDTO) {
    try {
      const newGenre = await GenreModel.create(genre);

      const createdGenre: GenreDTO = {
        ...newGenre,
        id: newGenre._id.toString(),
      };

      return createdGenre;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating genre: ${error.message}`);
      }

      throw new Error("Error creating genre");
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

      throw new Error("Error deleting genre");
    }
  }

  async findByName(name: string) {
    try {
      const genre = await GenreModel.findOne({ name });

      if (!genre) return null;

      const formatedGenre: GenreDTO = {
        ...genre,
        id: genre._id.toString(),
      };

      return formatedGenre;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error finding genre: ${error.message}`);
      }

      throw new Error("Error finding genre");
    }
  }

  async findAll() {
    try {
      const genres = await GenreModel.find();

      const formatedGenres: GenreDTO[] = genres.map((genre) => ({
        ...genre,
        id: genre._id.toString(),
      }));

      return formatedGenres;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error finding genres: ${error.message}`);
      }

      throw new Error("Error finding genres");
    }
  }
}

export default GenreRepository;
