import Genre from "../../domain/entity/Genre.js";

type GenreDocument = {
  _id: string;
  name: string;
  description: string;
  isAdultGenre: boolean;
  createdAt: Date;
  updatedAt: Date;
};

class GenrePersistenceMapper {
  static toDomain(genreDoc: GenreDocument) {
    return Genre.toDomain(genreDoc);
  }

  static toPersistence(genre: Genre) {
    return {
      _id: genre.id.value,
      name: genre.name.value,
      description: genre.description.value,
      isAdultGenre: genre.isAdultGenre,
      createdAt: genre.createdAt,
      updatedAt: genre.updatedAt,
    };
  }
}

export default GenrePersistenceMapper;
