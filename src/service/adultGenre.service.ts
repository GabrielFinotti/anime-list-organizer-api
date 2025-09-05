import { AdultGenreDTO } from "@/interface/dto/adultGenre.dto";
import AdultGenreRepository from "@/repository/adultGenre.repository";
import { isObjectIdOrHexString } from "mongoose";

class AdultGenreService {
  constructor(private adultGenreRepository = new AdultGenreRepository()) {}

  async createAdultGenre(adultGenre: AdultGenreDTO) {
    try {
      const existingAdultGenre = await this.adultGenreRepository.findByName(
        adultGenre.name
      );

      if (existingAdultGenre) {
        return null;
      }

      const createdAdultGenre = await this.adultGenreRepository.create(
        adultGenre
      );

      return createdAdultGenre;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error creating adult genre");
    }
  }

  async deleteAdultGenre(id: string) {
    try {
      if (!isObjectIdOrHexString(id)) {
        return null;
      }

      return await this.adultGenreRepository.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error deleting adult genre");
    }
  }

  async getAllAdultGenres() {
    try {
      const adultGenres = await this.adultGenreRepository.findAll();

      if (adultGenres.length === 0) {
        return null;
      }

      return adultGenres;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error getting all adult genres");
    }
  }
}

export default AdultGenreService;
