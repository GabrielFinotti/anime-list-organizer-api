import AnimeModel from "@/database/model/anime.model";
import CategoryModel from "@/database/model/category.model";
import GenreModel from "@/database/model/genre.model";
import { AnimeDTO } from "@/interface/dto/anime.dto";
import { IAnimeRepository } from "@/interface/repository/anime.repository";
import animeNormalization from "@/utils/normalize/anime.normalize";
import { Types } from "mongoose";

type AnimeFilter = {
  name?: { $regex: string; $options: string } | string;
  category?: Types.ObjectId;
  genres?: { $in: Types.ObjectId[] };
};

class AnimeRepository implements IAnimeRepository {
  async create(anime: AnimeDTO) {
    try {
      const normalizedAnime = await animeNormalization(anime);

      const newAnime = await AnimeModel.create(normalizedAnime);

      const createdAnime: AnimeDTO = {
        ...newAnime,
        id: newAnime._id.toString(),
        category: await newAnime.populate("category"),
        genres: await newAnime.populate("genres"),
        releaseDate: newAnime.releaseDate.toLocaleDateString("pt-BR"),
      };

      return createdAnime;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating anime: ${error.message}`);
      }

      throw new Error("Error creating anime");
    }
  }

  async update(anime: Partial<AnimeDTO>) {
    try {
      const normalizedAnime = await animeNormalization(anime);

      const updateAnime = await AnimeModel.findByIdAndUpdate(
        normalizedAnime.id,
        normalizedAnime,
        {
          new: true,
        }
      );

      if (!updateAnime) {
        return null;
      }

      const updatedAnime: AnimeDTO = {
        ...updateAnime,
        id: updateAnime._id.toString(),
        category: await updateAnime.populate("category"),
        genres: await updateAnime.populate("genres"),
        releaseDate: updateAnime.releaseDate.toLocaleDateString("pt-BR"),
      };

      return updatedAnime;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating anime: ${error.message}`);
      }

      throw new Error("Error updating anime");
    }
  }

  async delete(id: string) {
    try {
      const deletedAnime = await AnimeModel.findByIdAndDelete(id);

      return !!deletedAnime;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting anime: ${error.message}`);
      }

      throw new Error("Error deleting anime");
    }
  }

  async deleteAll() {
    try {
      await AnimeModel.deleteMany({});

      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting all animes: ${error.message}`);
      }

      throw new Error("Error deleting all animes");
    }
  }

  async findByQuery(name?: string, category?: string, genre?: string) {
    try {
      const filter: Partial<AnimeFilter> = {};

      if (name) {
        filter.name = { $regex: name, $options: "i" };
      }

      if (category) {
        const categoryDoc = await CategoryModel.findOne({ name: category });

        if (categoryDoc) {
          filter.category = categoryDoc._id;
        } else {
          throw new Error("Category not found");
        }
      }

      if (genre) {
        const genreDoc = await GenreModel.findOne({ name: genre });

        if (genreDoc) {
          filter.genres = { $in: [genreDoc._id] };
        } else {
          throw new Error("Genre not found");
        }
      }

      const filteredAnimes = await AnimeModel.find(filter);

      const animes: AnimeDTO[] = await Promise.all(
        filteredAnimes.map(async (anime) => ({
          ...anime,
          id: anime._id.toString(),
          category: await anime.populate("category"),
          genres: await anime.populate("genres"),
          releaseDate: anime.releaseDate.toLocaleDateString("pt-BR"),
        }))
      );

      return animes;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error finding animes by query: ${error.message}`);
      }

      throw new Error("Error finding animes by query");
    }
  }

  async findById(id: string) {
    try {
      const anime = await AnimeModel.findById(id);

      if (!anime) {
        return null;
      }

      const formatedAnime: AnimeDTO = {
        ...anime,
        id: anime._id.toString(),
        category: await anime.populate("category"),
        genres: await anime.populate("genres"),
        releaseDate: anime.releaseDate.toLocaleDateString("pt-BR"),
      };

      return formatedAnime;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error finding anime by id: ${error.message}`);
      }

      throw new Error("Error finding anime by id");
    }
  }

  async findByCategory(category: string) {
    try {
      const categoryDoc = await CategoryModel.findOne({ name: category });

      if (!categoryDoc) {
        throw new Error("Category not found");
      }

      const animes = await AnimeModel.find({ category: categoryDoc._id });

      const formatedAnime: AnimeDTO[] = await Promise.all(
        animes.map(async (anime) => ({
          ...anime,
          id: anime._id.toString(),
          category: await anime.populate("category"),
          genres: await anime.populate("genres"),
          releaseDate: anime.releaseDate.toLocaleDateString("pt-BR"),
        }))
      );

      return formatedAnime;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error finding animes by category: ${error.message}`);
      }

      throw new Error("Error finding animes by category");
    }
  }

  async findByGenre(genre: string) {
    try {
      const genreDoc = await GenreModel.findOne({ name: genre });

      if (!genreDoc) {
        throw new Error("Genre not found");
      }

      const animes = await AnimeModel.find({ genres: { $in: [genreDoc._id] } });

      const formatedAnime: AnimeDTO[] = await Promise.all(
        animes.map(async (anime) => ({
          ...anime,
          id: anime._id.toString(),
          category: await anime.populate("category"),
          genres: await anime.populate("genres"),
          releaseDate: anime.releaseDate.toLocaleDateString("pt-BR"),
        }))
      );

      return formatedAnime;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error finding animes by genre: ${error.message}`);
      }

      throw new Error("Error finding animes by genre");
    }
  }
}

export default AnimeRepository;
