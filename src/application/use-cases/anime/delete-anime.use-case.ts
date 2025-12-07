import { IAnimeRepository } from '../../../domain/repositories/anime.repository.js';
import { NotFoundError } from '../../errors/index.js';
import { IR2Service } from '../../services/index.js';
import slugify from '../../utils/slugify.js';

export class DeleteAnimeUseCase {
  constructor(
    private readonly animeRepository: IAnimeRepository,
    private readonly r2Service: IR2Service,
  ) {}

  async execute(id: string): Promise<void> {
    const anime = await this.animeRepository.findById(id);

    if (!anime) {
      throw new NotFoundError('Anime', id);
    }

    const fileName = slugify(anime.name.value);
    await this.r2Service.deleteObject(`animes/${anime.id.value}/${fileName}.webp`);

    await this.animeRepository.delete(id);
  }
}

export default DeleteAnimeUseCase;
