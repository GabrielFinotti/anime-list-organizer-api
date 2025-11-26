import Genre from '../../../../src/domain/entities/Genre.entity';
import GenreMapper from '../../../../src/application/mappers/genre.mapper';

describe('GenreMapper', () => {
  it('toPersistence, toDomain and toResponse should work consistently', () => {
    const genre = Genre.create('Comedy', 'Light and humorous stories', false);

    const persistence = GenreMapper.toPersistence(genre as any);

    expect(persistence._id).toBe(genre.id.value);
    expect(persistence.name).toBe(genre.name.value);
    expect(persistence.description).toBe(genre.description.value);
    expect(persistence.isAdultContent).toBe(genre.isAdultContent);

    const domain = GenreMapper.toDomain({
      _id: persistence._id,
      name: persistence.name,
      description: persistence.description,
      isAdultContent: persistence.isAdultContent,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
    } as any);

    expect(domain.id.value).toBe(genre.id.value);

    const response = GenreMapper.toResponse(genre as any);
    expect(response.id).toBe(genre.id.value);
  });
});
