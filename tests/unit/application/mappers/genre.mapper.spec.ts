import Genre from '../../../../src/domain/entities/Genre.entity';
import GenreMapper from '../../../../src/application/mappers/genre.mapper';

describe('GenreMapper', () => {
  it('toResponse should map domain to DTO correctly', () => {
    const genre = Genre.create('Comedy', 'Light and humorous stories', false);

    const response = GenreMapper.toResponse(genre as any);

    expect(response.id).toBe(genre.id.value);
    expect(response.name).toBe(genre.name.value);
    expect(response.description).toBe(genre.description.value);
    expect(response.isAdultContent).toBe(genre.isAdultContent);
  });
});
