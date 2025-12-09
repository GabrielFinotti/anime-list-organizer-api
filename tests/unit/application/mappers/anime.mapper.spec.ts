import Anime from '../../../../src/domain/entities/Anime.entity';
import Category from '../../../../src/domain/entities/Category.entity';
import Genre from '../../../../src/domain/entities/Genre.entity';
import Movie from '../../../../src/domain/value-objects/movie.value-object';
import Season from '../../../../src/domain/value-objects/season.value-object';
import AnimeMapper from '../../../../src/application/mappers/anime.mapper';

describe('AnimeMapper', () => {
  it('toResponse should map domain to DTO correctly', () => {
    const category = Category.create('Action', 'Ação', 'General', 'Action description');
    const genre = Genre.create('Adventure', 'Adventure desc', false);
    const movie = Movie.create({ name: 'M A', releaseDate: new Date(2023, 1, 1) });
    const season = Season.create({
      seasonNumber: 1,
      releaseDate: new Date(2022, 0, 1),
      totalEpisodes: 8,
    });

    const anime = Anime.create({
      imageUrl: 'http://example.com/pic.png',
      name: 'Mapping Anime',
      synopsis: 'Synopsis for mapping',
      category,
      genres: [genre],
      animeType: 'mixed',
      productionType: 'original',
      typeOfMaterialOrigin: 'none',
      movies: [movie],
      seasons: [season],
      isAdultContent: false,
    });

    const response = AnimeMapper.toResponse(anime as any);

    expect(response.id).toBe(anime.id.value);
    expect(response.name).toBe(anime.name.value);
    expect(response.imageUrl).toBe(anime.imageUrl.value);
    expect(response.synopsis).toBe(anime.synopsis.value);
    expect(response.animeType).toBe(anime.animeType);
    expect(response.productionType).toBe(anime.productionType);
    expect(response.typeOfMaterialOrigin).toBe(anime.typeOfMaterialOrigin);
    expect(response.isAdultContent).toBe(anime.isAdultContent);
    expect(response.genres).toHaveLength(1);
    expect(response.genres[0].id).toBe(genre.id.value);
    expect(response.category.id).toBe(category.id.value);
    expect(response.movies).toHaveLength(1);
    expect(response.movies![0].title).toBe(movie.title.value);
    expect(response.seasons).toHaveLength(1);
    expect(response.seasons![0].seasonNumber).toBe(season.seasonNumber);
  });
});
