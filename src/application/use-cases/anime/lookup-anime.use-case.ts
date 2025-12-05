import ApplicationError from '../../errors/application.error.js';
import ValidationError from '../../errors/validation.error.js';
import { ILookupAnimeService } from '../../services/lookupAnime.service.js';

export class LookupAnimeUseCase {
  constructor(private readonly lookupAnimeService: ILookupAnimeService) {}

  async execute(title: string) {
    try {
      if (!title || title.trim() === '' || typeof title !== 'string') {
        throw new ValidationError('Title must be a non-empty string', 'title', 'INVALID_TITLE');
      }

      return await this.lookupAnimeService.getAnimeData(title);
    } catch (error) {
      if (error instanceof Error) {
        throw new ApplicationError(error.message, 500);
      }

      throw new ApplicationError('An unknown error occurred', 500);
    }
  }
}

export default LookupAnimeUseCase;
