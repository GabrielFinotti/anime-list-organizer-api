import Genre from '../../domain/entities/Genre.entity.js';
import { IGenreRepository } from '../../domain/repositories/genre.repository.js';
import GenrePersistenceMapper, { GenreDocument } from '../mappers/genre.persistence-mapper.js';
import GenreModel from '../database/models/genre.model.js';

class GenreRepositoryImpl implements IGenreRepository {
  async findById(id: string): Promise<Genre | null> {
    const genreDoc = await GenreModel.findById(id).lean<GenreDocument>();

    if (!genreDoc) {
      return null;
    }

    return GenrePersistenceMapper.toDomain(genreDoc);
  }

  async findByName(name: string): Promise<Genre | null> {
    const genreDoc = await GenreModel.findOne({ name }).lean<GenreDocument>();

    if (!genreDoc) {
      return null;
    }

    return GenrePersistenceMapper.toDomain(genreDoc);
  }

  async findAll(): Promise<Genre[]> {
    const genreDocs = await GenreModel.find().lean<GenreDocument[]>();

    return genreDocs.map((doc) => GenrePersistenceMapper.toDomain(doc));
  }

  async create(genre: Genre): Promise<void> {
    await GenreModel.create(GenrePersistenceMapper.toPersistence(genre));
  }

  async delete(id: string): Promise<void> {
    await GenreModel.findByIdAndDelete(id);
  }
}

export default GenreRepositoryImpl;
