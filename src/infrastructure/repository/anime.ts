import Anime from "../../domain/entity/Anime.js";
import { IAnimeRepository } from "../../domain/repository/anime.js";
import { ICategoryRepository } from "../../domain/repository/category.js";
import { IGenreRepository } from "../../domain/repository/genre.js";
import AnimeModel from "../database/models/anime.js";
import AnimePersistenceMapper, { AnimeDocument } from "../mapper/anime.js";

class AnimeRepositoryImpl implements IAnimeRepository {
  private constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly genreRepository: IGenreRepository,
  ) {}

  async findById(id: string) {
    const anime = await AnimeModel.findById(id).lean<AnimeDocument>();

    return anime ? this.mapToDomain(anime) : null;
  }

  async findByTitle(title: string) {
    const anime = await AnimeModel.findOne({
      title,
    }).lean<AnimeDocument>();

    return anime ? this.mapToDomain(anime) : null;
  }

  async findAll() {
    const animes = await AnimeModel.find().lean<AnimeDocument[]>();

    return Promise.all(animes.map((doc) => this.mapToDomain(doc)));
  }

  async create(anime: Anime) {
    await AnimeModel.create(AnimePersistenceMapper.toPersistence(anime));
  }

  async update(anime: Anime) {
    await AnimeModel.findByIdAndUpdate(
      anime.id,
      AnimePersistenceMapper.toPersistence(anime),
    );

    return anime;
  }

  async delete(id: string) {
    await AnimeModel.findByIdAndDelete(id);
  }

  private async mapToDomain(animeDoc: AnimeDocument) {
    const category = await this.categoryRepository.findById(animeDoc.category);

    if (!category) {
      throw new Error(`Category with ID ${animeDoc.category} not found`);
    }

    const genres = await Promise.all(
      animeDoc.genres.map(async (genreId) => {
        const genre = await this.genreRepository.findById(genreId);

        if (!genre) {
          throw new Error(`Genre with ID ${genreId} not found`);
        }

        return genre;
      }),
    );

    return AnimePersistenceMapper.toDomain(animeDoc, category, genres);
  }
}

export default AnimeRepositoryImpl;
