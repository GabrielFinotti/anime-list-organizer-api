import AdultGenreModel from "@/database/model/adultGenre.model";
import { AdultGenreDTO } from "@/interface/dto/adultGenre.dto";
import { IAdultGenreRepository } from "@/interface/repository/adultGenre.repository";

class AdultGenreRepository implements IAdultGenreRepository {
  async create(adultGenre: AdultGenreDTO) {
    try {
      const newAdultGenre = await AdultGenreModel.create(adultGenre);

      const createdAdultGenre: AdultGenreDTO = {
        id: newAdultGenre._id.toString(),
        name: newAdultGenre.name,
        characteristics: newAdultGenre.characteristics,
      };

      return createdAdultGenre;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating adult genre: ${error.message}`);
      }

      throw new Error("Error creating adult genre");
    }
  }

  async delete(id: string) {
    try {
      const deleted = await AdultGenreModel.findByIdAndDelete(id);

      return !!deleted;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting adult genre: ${error.message}`);
      }

      throw new Error("Error deleting adult genre");
    }
  }

  async findByName(name: string) {
    try {
      const adultGenre = await AdultGenreModel.findOne({ name });

      if (!adultGenre) return null;

      const formatedAdultGenre: AdultGenreDTO = {
        id: adultGenre._id.toString(),
        name: adultGenre.name,
        characteristics: adultGenre.characteristics,
      };

      return formatedAdultGenre;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error finding adult genre by name: ${error.message}`);
      }

      throw new Error("Error finding adult genre by name");
    }
  }

  async findAll() {
    try {
      const adultGenres = await AdultGenreModel.find();

      const formatedAdultGenres: AdultGenreDTO[] = adultGenres.map(
        (adultGenre) => ({
          id: adultGenre._id.toString(),
          name: adultGenre.name,
          characteristics: adultGenre.characteristics,
        })
      );

      return formatedAdultGenres;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error finding all adult genres: ${error.message}`);
      }

      throw new Error("Error finding all adult genres");
    }
  }
}

export default AdultGenreRepository;
