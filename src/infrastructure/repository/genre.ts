import Genre from "../../domain/entity/Genre.js";
import { IGenreRepository } from "../../domain/repository/genre.js";
import GenreModel from "../database/models/genre.js";
import GenrePersistenceMapper, { GenreDocument } from "../mapper/genre.js";

class GenreRepositoryImpl implements IGenreRepository {
  private constructor() {}

  async findById(id: string) {
    const genre = await GenreModel.findById(id).lean<GenreDocument>();

    return genre ? GenrePersistenceMapper.toDomain(genre) : null;
  }

  async findByName(name: string) {
    const genre = await GenreModel.findOne({
      name,
    }).lean<GenreDocument>();

    return genre ? GenrePersistenceMapper.toDomain(genre) : null;
  }

  async findAll() {
    const genres = await GenreModel.find().lean<GenreDocument[]>();

    return genres.map((doc) => GenrePersistenceMapper.toDomain(doc));
  }

  async create(genre: Genre) {
    await GenreModel.create(GenrePersistenceMapper.toPersistence(genre));
  }

  async delete(id: string) {
    await GenreModel.findByIdAndDelete(id);
  }
}

export default GenreRepositoryImpl;
