import Genre from '../../domain/entities/Genre.entity.js';
import { GenreOutputDTO } from '../dtos/genre.dto.js';

class GenreMapper {
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
