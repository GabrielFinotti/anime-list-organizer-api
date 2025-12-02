import { IAnimeRepository } from '../../../domain/repositories/anime.repository.js';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.js';
import { IGenreRepository } from '../../../domain/repositories/genre.repository.js';
import Anime from '../../../domain/entities/Anime.entity.js';
import Movie from '../../../domain/value-objects/movie.value-object.js';
import Season from '../../../domain/value-objects/season.value-object.js';
import { AnimeInputDTO, AnimeOutputDTO } from '../../dtos/anime.dto.js';
import AnimeMapper from '../../mappers/anime.mapper.js';
import { NotFoundError, ConflictError } from '../../errors/index.js';

export class CreateAnimeUseCase {
  constructor(
    private readonly animeRepository: IAnimeRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly genreRepository: IGenreRepository,
  ) {}

  async execute(input: AnimeInputDTO): Promise<AnimeOutputDTO> {
    const existingAnime = await this.animeRepository.findByTitle(input.name);

    if (existingAnime) {
      throw new ConflictError('Anime', 'name', input.name);
    }

    const category = await this.categoryRepository.findById(input.categoryId);

    if (!category) {
      throw new NotFoundError('Category', input.categoryId);
    }

    const genres = await Promise.all(input.genreIds.map((id) => this.genreRepository.findById(id)));

    const missingGenreIndex = genres.findIndex((g) => g === null);

    if (missingGenreIndex !== -1) {
      throw new NotFoundError('Genre', input.genreIds[missingGenreIndex]);
    }

    const movies = input.movies.map((m) => Movie.create({
      name: m.name,
      releaseDate: new Date(m.releaseDate),
    }));
    const seasons = input.seasons.map((s) => Season.create({
      seasonNumber: s.seasonNumber,
      releaseDate: new Date(s.releaseDate),
      totalEpisodes: s.totalEpisodes,
    }));

    const anime = Anime.create({
      imageUrl: input.imageUrl,
      name: input.name,
      synopsis: input.synopsis,
      category,
      genres: genres.filter((g) => g !== null),
      animeType: input.animeType,
      productionType: input.productionType,
      movies,
      seasons,
      isAdultContent: input.isAdultContent,
    });

    const savedAnime = await this.animeRepository.create(anime);

    return AnimeMapper.toResponse(savedAnime);
  }
}

export default CreateAnimeUseCase;
