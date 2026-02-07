import {
  ILookupAnimeService,
  PromptResponse,
} from '../../../../application/services/lookupAnime.service.js';
import { ICategoryRepository } from '../../../../domain/repositories/category.repository.js';
import { IGenreRepository } from '../../../../domain/repositories/genre.repository.js';
import AnimeAgentConfig from '../config/animeAgent.config.js';
import buildPrompt from '../utils/buildPrompt.js';

class LookupAnimeService implements ILookupAnimeService {
  private readonly apiClient: AnimeAgentConfig;

  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly genreRepository: IGenreRepository,
  ) {
    this.apiClient = AnimeAgentConfig.getInstance();
  }

  async getAnimeData(title: string) {
    try {
      const genres = (await this.genreRepository.findAll()).map((g) => ({
        name: g.name.value,
        isAdultContent: g.isAdultContent,
      }));
      const categories = (await this.categoryRepository.findAll()).map((c) => c.name.value);

      const prompt = buildPrompt(title, categories, genres);
      const agente = this.apiClient.clientInstance;

      const response = await agente.responses.create({
        model: 'gpt-5-mini',
        service_tier: 'flex',
        store: false,
        tools: [{ type: 'web_search' }],
        input: [
          {
            role: 'system',
            content:
              'Você é um assistente especialista em anime que responde apenas em JSON conforme solicitado.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      if (response.error) {
        throw new Error(
          `LookupAnimeService API error: ${response.error.message}, code: ${response.error.code}`,
        );
      }

      return this.parseResponse(response.output_text);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      throw new Error('LookupAnimeService getAnimeData unknown error');
    }
  }

  private parseResponse(responseText: string): PromptResponse {
    const cleanedText = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleanedText);

    const promptResponse: PromptResponse = {
      anime: {
        name: String(parsed.anime?.name ?? ''),
        synopsis: String(parsed.anime?.synopsis ?? ''),
        category: String(parsed.anime?.category ?? ''),
        genres: Array.isArray(parsed.anime?.genres) ? parsed.anime.genres.map(String) : [],
        animeType: this.validateAnimeType(parsed.anime?.animeType),
        productionType: this.validateProductionType(parsed.anime?.productionType),
        typeOfMaterialOrigin: this.validateTypeOfMaterialOrigin(parsed.anime?.typeOfMaterialOrigin),
        movies: this.parseMovies(parsed.anime?.movies),
        seasons: this.parseSeasons(parsed.anime?.seasons),
        isAdultContent: Boolean(parsed.anime?.isAdultContent),
      },
      observedDetails: Array.isArray(parsed.observedDetails)
        ? parsed.observedDetails.map(String)
        : [],
    };

    return promptResponse;
  }

  private validateAnimeType(value: unknown): 'serie' | 'movie' | 'mixed' {
    const validTypes = ['serie', 'movie', 'mixed'];

    if (validTypes.includes(value as string)) {
      return value as 'serie' | 'movie' | 'mixed';
    }

    return 'serie';
  }

  private validateProductionType(value: unknown): 'original' | 'adaptation' {
    const validProductionType = ['original', 'adaptation'];

    if (validProductionType.includes(value as string)) {
      return value as 'original' | 'adaptation';
    }

    return 'original';
  }

  private validateTypeOfMaterialOrigin(
    value: unknown,
  ): 'manga' | 'light_novel' | 'visual_novel' | 'game' | 'other' | 'none' {
    const validTypes = ['manga', 'light_novel', 'visual_novel', 'game', 'other', 'none'];

    if (validTypes.includes(value as string)) {
      return value as 'manga' | 'light_novel' | 'visual_novel' | 'game' | 'other' | 'none';
    }

    return 'none';
  }

  private parseMovies(movies: unknown): { title: string; releaseDate: Date }[] {
    if (!Array.isArray(movies)) {
      return [];
    }

    return movies.map((movie) => ({
      title: String(movie?.title ?? ''),
      releaseDate: this.parseDate(movie?.releaseDate),
    }));
  }

  private parseSeasons(
    seasons: unknown,
  ): { seasonNumber: number; releaseDate: Date; totalEpisodes: number }[] {
    if (!Array.isArray(seasons)) {
      return [];
    }

    return seasons.map((season) => ({
      seasonNumber: Number(season?.seasonNumber) || 0,
      releaseDate: this.parseDate(season?.releaseDate),
      totalEpisodes: Number(season?.totalEpisodes) || 0,
    }));
  }

  private parseDate(value: unknown): Date {
    if (!value || value === '') {
      return new Date(0);
    }

    const date = new Date(String(value));
    return isNaN(date.getTime()) ? new Date(0) : date;
  }
}

export default LookupAnimeService;
