import Anime from '../../domain/entities/Anime.entity.js';
import { IAnimeRepository } from '../../domain/repositories/anime.repository.js';
import { ICategoryRepository } from '../../domain/repositories/category.repository.js';
import { IGenreRepository } from '../../domain/repositories/genre.repository.js';
import AnimePersistenceMapper, { AnimeDocument } from '../mappers/anime.persistence-mapper.js';
import AnimeModel from '../database/models/anime.model.js';

class AnimeRepositoryImpl implements IAnimeRepository {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly genreRepository: IGenreRepository,
  ) {}

  async findById(id: string): Promise<Anime | null> {
    const animeDoc = await AnimeModel.findById(id).lean<AnimeDocument>();

    if (!animeDoc) {
      return null;
    }

    return this.mapToDomain(animeDoc);
  }

  async findByTitle(title: string): Promise<Anime | null> {
    const animeDoc = await AnimeModel.findOne({ name: title }).lean<AnimeDocument>();

    if (!animeDoc) {
      return null;
    }

    return this.mapToDomain(animeDoc);
  }

  async findAll(): Promise<Anime[]> {
    const animeDocs = await AnimeModel.find().lean<AnimeDocument[]>();

    return Promise.all(animeDocs.map((doc) => this.mapToDomain(doc)));
  }

  async create(anime: Anime): Promise<Anime> {
    await AnimeModel.create(AnimePersistenceMapper.toPersistence(anime));

    return anime;
  }

  async update(anime: Anime): Promise<Anime> {
    await AnimeModel.findByIdAndUpdate(anime.id.value, AnimePersistenceMapper.toPersistence(anime));

    return anime;
  }

  async delete(id: string): Promise<void> {
    await AnimeModel.findByIdAndDelete(id);
  }

  private async mapToDomain(doc: AnimeDocument): Promise<Anime> {
    const category = await this.categoryRepository.findById(doc.category);

    if (!category) {
      throw new Error(`Category with id ${doc.category} not found`);
    }

    const genres = await Promise.all(
      doc.genres.map(async (genreId) => {
        const genre = await this.genreRepository.findById(genreId);

        if (!genre) {
          throw new Error(`Genre with id ${genreId} not found`);
        }

        return genre;
      }),
    );

    return AnimePersistenceMapper.toDomain(doc, category, genres);
  }
}

export default AnimeRepositoryImpl;
