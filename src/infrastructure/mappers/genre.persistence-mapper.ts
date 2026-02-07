import Genre from '../../domain/entities/Genre.entity.js';

export type GenreDocument = {
  _id: string;
  name: string;
  description: string;
  isAdultContent: boolean;
  createdAt: Date;
  updatedAt: Date;
};

class GenrePersistenceMapper {
  static toDomain(doc: GenreDocument): Genre {
    return Genre.toDomain({
      id: doc._id,
      name: doc.name,
      description: doc.description,
      isAdultContent: doc.isAdultContent,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(genre: Genre): GenreDocument {
    return {
      _id: genre.id.value,
      name: genre.name.value,
      description: genre.description.value,
      isAdultContent: genre.isAdultContent,
      createdAt: genre.createdAt,
      updatedAt: genre.updatedAt,
    };
  }
}

export default GenrePersistenceMapper;
