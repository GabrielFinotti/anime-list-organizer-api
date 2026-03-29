import Genre from "../../domain/entity/Genre.js";

class GenreApplicationMapper {
    static toResponse(genre: Genre) {
        return {
            id: genre.id.value,
            name: genre.name.value,
            description: genre.description.value,
            isAdultGenre: genre.isAdultGenre,
            createdAt: genre.createdAt,
            updatedAt: genre.updatedAt
        }
    }
}

export default GenreApplicationMapper;