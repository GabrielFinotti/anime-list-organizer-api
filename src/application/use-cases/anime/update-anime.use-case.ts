import { IAnimeRepository } from '../../../domain/repositories/anime.repository.js';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.js';
import { AnimeOutputDTO, UpdateAnimeInputDTO } from '../../dtos/anime.dto.js';
import AnimeMapper from '../../mappers/anime.mapper.js';
import { NotFoundError } from '../../errors/index.js';
import Category from '../../../domain/entities/Category.entity.js';

export class UpdateAnimeUseCase {
  constructor(
    private readonly animeRepository: IAnimeRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(input: UpdateAnimeInputDTO): Promise<AnimeOutputDTO> {
    const anime = await this.animeRepository.findById(input.id);

    if (!anime) {
      throw new NotFoundError('Anime', input.id);
    }

    let category: Category | undefined;

    if (input.categoryId) {
      const foundCategory = await this.categoryRepository.findById(input.categoryId);

      if (!foundCategory) {
        throw new NotFoundError('Category', input.categoryId);
      }

      category = foundCategory;
    }

    anime.updateCommonInfo({
      name: input.name,
      synopsis: input.synopsis,
      category,
      animeType: input.animeType,
      productionType: input.productionType,
      isAdultContent: input.isAdultContent,
    });

    if (input.imageUrl) {
      anime.updateImageUrl(input.imageUrl);
    }

    const updatedAnime = await this.animeRepository.update(anime);

    return AnimeMapper.toResponse(updatedAnime);
  }
}

export default UpdateAnimeUseCase;
