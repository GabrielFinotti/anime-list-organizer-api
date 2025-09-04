import AnimeModel from "@/database/model/anime.model";
import { AnimeDTO } from "@/interface/dto/anime.dto";
import { IAnimeRepository } from "@/interface/repository/anime.repository";
import animeNormalization from "@/utils/normalize/anime.normalize";
import CategoryRepository from "./category.repository";
import GenreRepository from "./genre.repository";

type AnimeFilter = {
  name?: { $regex: string; $options: string } | string;
  category?: string;
  genres?: { $in: (string | undefined)[] };
};

class AnimeRepository implements IAnimeRepository {
  constructor(
    private categoryRepository = new CategoryRepository(),
    private genreRepository = new GenreRepository()
  ) {}

  async create(anime: AnimeDTO) {
    try {
      const normalizedAnime = await animeNormalization(anime);

      const newAnime = await AnimeModel.create(normalizedAnime);

      const createdAnime: AnimeDTO = {
        id: newAnime._id.toString(),
        name: newAnime.name,
        synopsis: newAnime.synopsis,
        category: await newAnime.populate("category"),
        genres: await newAnime.populate("genres"),
        adultGenres: await newAnime.populate("adultGenres"),
        typeOfMaterialOrigin: newAnime.typeOfMaterialOrigin,
        materialOriginName: newAnime.materialOriginName,
        releaseDate: newAnime.releaseDate.toLocaleDateString("pt-BR"),
        isMovie: newAnime.isMovie,
        isAdult: newAnime.isAdult,
        derivate: newAnime.derivate,
        lastReleaseSeason: newAnime.lastReleaseSeason,
        lastWatchedSeason: newAnime.lastWatchedSeason,
        lastWatchedEpisode: newAnime.lastWatchedEpisode,
        status: newAnime.status,
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
        id: updateAnime._id.toString(),
        name: updateAnime.name,
        synopsis: updateAnime.synopsis,
        category: await updateAnime.populate("category"),
        genres: await updateAnime.populate("genres"),
        adultGenres: await updateAnime.populate("adultGenres"),
        typeOfMaterialOrigin: updateAnime.typeOfMaterialOrigin,
        materialOriginName: updateAnime.materialOriginName,
        releaseDate: updateAnime.releaseDate.toLocaleDateString("pt-BR"),
        isMovie: updateAnime.isMovie,
        isAdult: updateAnime.isAdult,
        derivate: updateAnime.derivate,
        lastReleaseSeason: updateAnime.lastReleaseSeason,
        lastWatchedSeason: updateAnime.lastWatchedSeason,
        lastWatchedEpisode: updateAnime.lastWatchedEpisode,
        status: updateAnime.status,
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
        const categoryDoc = await this.categoryRepository.findByName(category);

        if (categoryDoc) filter.category = categoryDoc.id;
      }

      if (genre) {
        const genreDoc = await this.genreRepository.findByName(genre);

        if (genreDoc) filter.genres = { $in: [genreDoc.id] };
      }

      const filteredAnimes = await AnimeModel.find(filter);

      const animes: AnimeDTO[] = await Promise.all(
        filteredAnimes.map(async (anime) => ({
          id: anime._id.toString(),
          name: anime.name,
          synopsis: anime.synopsis,
          category: await anime.populate("category"),
          genres: await anime.populate("genres"),
          adultGenres: await anime.populate("adultGenres"),
          typeOfMaterialOrigin: anime.typeOfMaterialOrigin,
          materialOriginName: anime.materialOriginName,
          releaseDate: anime.releaseDate.toLocaleDateString("pt-BR"),
          isMovie: anime.isMovie,
          isAdult: anime.isAdult,
          derivate: anime.derivate,
          lastReleaseSeason: anime.lastReleaseSeason,
          lastWatchedSeason: anime.lastWatchedSeason,
          lastWatchedEpisode: anime.lastWatchedEpisode,
          status: anime.status,
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
        id: anime._id.toString(),
        name: anime.name,
        synopsis: anime.synopsis,
        category: await anime.populate("category"),
        genres: await anime.populate("genres"),
        adultGenres: await anime.populate("adultGenres"),
        typeOfMaterialOrigin: anime.typeOfMaterialOrigin,
        materialOriginName: anime.materialOriginName,
        releaseDate: anime.releaseDate.toLocaleDateString("pt-BR"),
        isMovie: anime.isMovie,
        isAdult: anime.isAdult,
        derivate: anime.derivate,
        lastReleaseSeason: anime.lastReleaseSeason,
        lastWatchedSeason: anime.lastWatchedSeason,
        lastWatchedEpisode: anime.lastWatchedEpisode,
        status: anime.status,
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
      const categoryDoc = await this.categoryRepository.findByName(category);

      if (!categoryDoc) return [];

      const animes = await AnimeModel.find({ category: categoryDoc.id });

      const formatedAnime: AnimeDTO[] = await Promise.all(
        animes.map(async (anime) => ({
          id: anime._id.toString(),
          name: anime.name,
          synopsis: anime.synopsis,
          category: await anime.populate("category"),
          genres: await anime.populate("genres"),
          adultGenres: await anime.populate("adultGenres"),
          typeOfMaterialOrigin: anime.typeOfMaterialOrigin,
          materialOriginName: anime.materialOriginName,
          releaseDate: anime.releaseDate.toLocaleDateString("pt-BR"),
          isMovie: anime.isMovie,
          isAdult: anime.isAdult,
          derivate: anime.derivate,
          lastReleaseSeason: anime.lastReleaseSeason,
          lastWatchedSeason: anime.lastWatchedSeason,
          lastWatchedEpisode: anime.lastWatchedEpisode,
          status: anime.status,
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
      const genreDoc = await this.genreRepository.findByName(genre);

      if (!genreDoc) return [];

      const animes = await AnimeModel.find({ genres: { $in: [genreDoc.id] } });

      const formatedAnime: AnimeDTO[] = await Promise.all(
        animes.map(async (anime) => ({
          id: anime._id.toString(),
          name: anime.name,
          synopsis: anime.synopsis,
          category: await anime.populate("category"),
          genres: await anime.populate("genres"),
          adultGenres: await anime.populate("adultGenres"),
          typeOfMaterialOrigin: anime.typeOfMaterialOrigin,
          materialOriginName: anime.materialOriginName,
          releaseDate: anime.releaseDate.toLocaleDateString("pt-BR"),
          isMovie: anime.isMovie,
          isAdult: anime.isAdult,
          derivate: anime.derivate,
          lastReleaseSeason: anime.lastReleaseSeason,
          lastWatchedSeason: anime.lastWatchedSeason,
          lastWatchedEpisode: anime.lastWatchedEpisode,
          status: anime.status,
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
