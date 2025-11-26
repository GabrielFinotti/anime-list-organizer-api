import Anime from '../../../../src/domain/entities/Anime.entity';
import Category from '../../../../src/domain/entities/Category.entity';
import Genre from '../../../../src/domain/entities/Genre.entity';
import Movie from '../../../../src/domain/value-objects/movie.value-object';
import Season from '../../../../src/domain/value-objects/season.value-object';
import AnimeMapper from '../../../../src/application/mappers/anime.mapper';

describe('AnimeMapper', () => {
  it('toPersistence and toResponse should map correctly', () => {
    const category = Category.create('Action', 'Action description');
    const genre = Genre.create('Adventure', 'Adventure desc', false);
    const movie = Movie.create({ name: 'M A', releaseDate: new Date(2023, 1, 1) });
    const season = Season.create({ seasonNumber: 1, releaseDate: new Date(2022, 0, 1), totalEpisodes: 8 });

    const anime = Anime.create({
      imageUrl: 'http://example.com/pic.png',
      name: 'Mapping Anime',
      synopsis: 'Synopsis for mapping',
      category,
      genres: [genre],
      animeType: 'mixed',
      productionType: 'original',
      movies: [movie],
      seasons: [season],
      isAdultContent: false,
    });

    const persistence = AnimeMapper.toPersistence(anime as any);
    expect(persistence._id).toBe(anime.id.value);
    expect(persistence.name).toBe(anime.name.value);
    expect(persistence.genres[0]).toBe(genre.id.value);

    const response = AnimeMapper.toResponse(anime as any);
    expect(response.id).toBe(anime.id.value);
    expect(response.name).toBe(anime.name.value);
    expect(response.genres[0].id).toBe(genre.id.value);
    expect(response.category.id).toBe(category.id.value);
  });

  it('toDomain should reconstruct an Anime from persistence doc and domain relations', () => {
    const category = Category.create('Action', 'Action description');
    const genre = Genre.create('Adventure', 'Adventure desc', false);
    const movie = Movie.create({ name: 'M A', releaseDate: new Date(2023, 1, 1) });
    const season = Season.create({ seasonNumber: 1, releaseDate: new Date(2022, 0, 1), totalEpisodes: 8 });

    const anime = Anime.create({
      imageUrl: 'http://example.com/pic.png',
      name: 'Mapping Anime',
      synopsis: 'Synopsis for mapping',
      category,
      genres: [genre],
      animeType: 'mixed',
      productionType: 'original',
      movies: [movie],
      seasons: [season],
      isAdultContent: false,
    });

    const doc = {
      _id: anime.id.value,
      imageUrl: anime.imageUrl.value,
      name: anime.name.value,
      synopsis: anime.synopsis.value,
      category: category.id.value,
      genres: anime.genres.map((g) => g.id.value),
      animeType: anime.animeType,
      productionType: anime.productionType,
      movies: [{ title: movie.title.value, releaseDate: movie.releaseDate }],
      seasons: [{ seasonNumber: season.seasonNumber, releaseDate: season.releaseDate, totalEpisodes: season.totalEpisodes }],
      isAdultContent: anime.isAdultContent,
      createdAt: anime.createdAt,
      updatedAt: anime.updatedAt,
    } as any;

    const reconstructed = AnimeMapper.toDomain(doc, category, [genre]);

    expect(reconstructed).toBeDefined();
    expect(reconstructed.id.value).toBe(anime.id.value);
    expect(reconstructed.name.value).toBe(anime.name.value);
    expect(reconstructed.movies.length).toBe(1);
  });
});
