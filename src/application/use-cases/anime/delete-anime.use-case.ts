import { IAnimeRepository } from '../../../domain/repositories/anime.repository.js';
import { NotFoundError } from '../../errors/index.js';

export class DeleteAnimeUseCase {
  constructor(private readonly animeRepository: IAnimeRepository) {}

  async execute(id: string): Promise<void> {
    const anime = await this.animeRepository.findById(id);

    if (!anime) {
      throw new NotFoundError('Anime', id);
    }

    await this.animeRepository.delete(id);
  }
}

export default DeleteAnimeUseCase;
