import { AnimeDTO } from "@/interface/dto/anime.dto";
import AnimeRepository from "@/repository/anime.repository";
import { isObjectIdOrHexString } from "mongoose";

class AnimeService {
  constructor(private animeRepository = new AnimeRepository()) {}

  async createAnime(anime: AnimeDTO) {
    try {
      const existingAnime = await this.animeRepository.findByQuery(anime.name);

      if (existingAnime.length > 0) {
        return null;
      }

      const createdAnime = await this.animeRepository.create(anime);

      return createdAnime;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error creating category");
    }
  }

  async updateAnime(anime: Partial<AnimeDTO>) {
    try {
      if (!anime.id || !isObjectIdOrHexString(anime.id)) {
        return null;
      }

      const updatedAnime = await this.animeRepository.update(anime);

      return updatedAnime;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error updating anime");
    }
  }

  async deleteAnime(id: string) {
    try {
      if (!isObjectIdOrHexString(id)) {
        return null;
      }

      return await this.animeRepository.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error deleting anime");
    }
  }

  async deleteAllAnimes() {
    try {
      return await this.animeRepository.deleteAll();
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error deleting all animes");
    }
  }

  async getAnimeByQuery(name?: string, category?: string, genre?: string) {
    try {
      const animes = await this.animeRepository.findByQuery(
        name,
        category,
        genre
      );

      if (animes.length === 0) {
        return null;
      }

      return animes;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error getting anime by query");
    }
  }

  async getAnimeData(id: string) {
    try {
      if (!isObjectIdOrHexString(id)) {
        return null;
      }

      const anime = await this.animeRepository.findById(id);

      return anime;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error getting anime data");
    }
  }

  async getAnimeByCategory(category: string) {
    try {
      const animes = await this.animeRepository.findByCategory(category);

      if (animes.length === 0) {
        return null;
      }

      return animes;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error getting anime by category");
    }
  }

  async getAnimeByGenre(genre: string) {
    try {
      const animes = await this.animeRepository.findByGenre(genre);

      if (animes.length === 0) {
        return null;
      }

      return animes;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error getting anime by genre");
    }
  }

  async getAnimeByAdultGenre(adultGenre: string) {
    try {
      const animes = await this.animeRepository.findByAdultGenre(adultGenre);

      if (animes.length === 0) {
        return null;
      }

      return animes;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error getting anime by adult genre");
    }
  }
}

export default AnimeService;
