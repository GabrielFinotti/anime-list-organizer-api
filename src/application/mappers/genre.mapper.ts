import Genre from '../../domain/entities/Genre.entity.js';
import { GenreOutputDTO } from '../dtos/genre.dto.js';

type GenreDocument = {
  _id: string;
  name: string;
  description: string;
  isAdultContent: boolean;
  createdAt: Date;
  updatedAt: Date;
};

class GenreMapper {
  static toPersistence(genre: Genre) {
    return {
      _id: genre.id.value,
      name: genre.name.value,
      description: genre.description.value,
      isAdultContent: genre.isAdultContent,
      createdAt: genre.createdAt,
      updatedAt: genre.updatedAt,
    };
  }

  static toDomain(doc: GenreDocument) {
    return Genre.toDomain({
      id: doc._id,
      name: doc.name,
      description: doc.description,
      isAdultContent: doc.isAdultContent,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toResponse(genre: Genre): GenreOutputDTO {
    return {
      id: genre.id.value,
      name: genre.name.value,
      description: genre.description.value,
      isAdultContent: genre.isAdultContent,
    };
  }
}

export default GenreMapper;
