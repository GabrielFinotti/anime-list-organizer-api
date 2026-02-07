import buildPrompt from '../../../../../src/infrastructure/api/gpt/utils/buildPrompt';
import { GenreInput } from '../../../../../src/application/services/lookupAnime.service';

describe('buildPrompt', () => {
  const defaultCategories = ['Shounen', 'Seinen', 'Shoujo', 'Josei'];
  const defaultGenres: GenreInput[] = [
    { name: 'Action', isAdultContent: false },
    { name: 'Adventure', isAdultContent: false },
    { name: 'Romance', isAdultContent: false },
    { name: 'Ecchi', isAdultContent: true },
    { name: 'Hentai', isAdultContent: true },
  ];

  describe('basic prompt generation', () => {
    it('should generate a prompt with the given title', () => {
      const prompt = buildPrompt('Naruto', defaultCategories, defaultGenres);

      expect(prompt).toContain('Naruto');
    });

    it('should include all available categories in the prompt', () => {
      const prompt = buildPrompt('Test', defaultCategories, defaultGenres);

      defaultCategories.forEach((category) => {
        expect(prompt).toContain(category);
      });
    });

    it('should include all genre names in the prompt', () => {
      const prompt = buildPrompt('Test', defaultCategories, defaultGenres);

      defaultGenres.forEach((genre) => {
        expect(prompt).toContain(genre.name);
      });
    });

    it('should include adult genres list in the prompt', () => {
      const prompt = buildPrompt('Test', defaultCategories, defaultGenres);

      expect(prompt).toContain('Ecchi');
      expect(prompt).toContain('Hentai');
      expect(prompt).toContain('Gêneros adultos');
    });

    it('should include anime types in the prompt', () => {
      const prompt = buildPrompt('Test', defaultCategories, defaultGenres);

      expect(prompt).toContain('serie');
      expect(prompt).toContain('movie');
      expect(prompt).toContain('mixed');
    });

    it('should include production types in the prompt', () => {
      const prompt = buildPrompt('Test', defaultCategories, defaultGenres);

      expect(prompt).toContain('original');
      expect(prompt).toContain('adaptation');
    });
  });

  describe('JSON structure requirements', () => {
    it('should request JSON response format', () => {
      const prompt = buildPrompt('Test', defaultCategories, defaultGenres);

      expect(prompt).toContain('JSON');
      expect(prompt).toContain('Retorne somente o JSON');
    });

    it('should include expected response structure', () => {
      const prompt = buildPrompt('Test', defaultCategories, defaultGenres);

      expect(prompt).toContain('"anime"');
      expect(prompt).toContain('"name"');
      expect(prompt).toContain('"synopsis"');
      expect(prompt).toContain('"category"');
      expect(prompt).toContain('"genres"');
      expect(prompt).toContain('"animeType"');
      expect(prompt).toContain('"productionType"');
      expect(prompt).toContain('"movies"');
      expect(prompt).toContain('"seasons"');
      expect(prompt).toContain('"isAdultContent"');
      expect(prompt).toContain('"observedDetails"');
    });

    it('should include movie structure requirements', () => {
      const prompt = buildPrompt('Test', defaultCategories, defaultGenres);

      expect(prompt).toContain('"title"');
      expect(prompt).toContain('"releaseDate"');
    });

    it('should include season structure requirements', () => {
      const prompt = buildPrompt('Test', defaultCategories, defaultGenres);

      expect(prompt).toContain('"seasonNumber"');
      expect(prompt).toContain('"totalEpisodes"');
    });
  });

  describe('rules and instructions', () => {
    it('should include synopsis length requirements', () => {
      const prompt = buildPrompt('Test', defaultCategories, defaultGenres);

      expect(prompt).toContain('50-500');
      expect(prompt).toContain('pt-BR');
    });

    it('should include date format requirements', () => {
      const prompt = buildPrompt('Test', defaultCategories, defaultGenres);

      expect(prompt).toContain('YYYY-MM-DD');
    });

    it('should include web search instruction', () => {
      const prompt = buildPrompt('Test', defaultCategories, defaultGenres);

      expect(prompt).toContain('pesquisa na web');
    });

    it('should include observedDetails instruction', () => {
      const prompt = buildPrompt('Test', defaultCategories, defaultGenres);

      expect(prompt).toContain('observedDetails');
    });

    it('should include isAdultContent rule based on genres', () => {
      const prompt = buildPrompt('Test', defaultCategories, defaultGenres);

      expect(prompt).toContain('isAdultContent');
      expect(prompt).toContain('true se qualquer gênero selecionado estiver na lista adulta');
    });
  });

  describe('edge cases', () => {
    it('should handle empty categories array', () => {
      const prompt = buildPrompt('Test', [], defaultGenres);

      expect(prompt).toContain('Test');
      expect(prompt).toContain('Categorias permitidas: []');
    });

    it('should handle empty genres array', () => {
      const prompt = buildPrompt('Test', defaultCategories, []);

      expect(prompt).toContain('Test');
      expect(prompt).toContain('Gêneros permitidos: []');
      expect(prompt).toContain('Gêneros adultos: []');
    });

    it('should handle title with special characters', () => {
      const title = 'Re:Zero - Starting Life in Another World';
      const prompt = buildPrompt(title, defaultCategories, defaultGenres);

      expect(prompt).toContain(title);
    });

    it('should handle title with Japanese characters', () => {
      const title = '進撃の巨人';
      const prompt = buildPrompt(title, defaultCategories, defaultGenres);

      expect(prompt).toContain(title);
    });

    it('should handle genres with no adult content', () => {
      const nonAdultGenres: GenreInput[] = [
        { name: 'Action', isAdultContent: false },
        { name: 'Comedy', isAdultContent: false },
      ];

      const prompt = buildPrompt('Test', defaultCategories, nonAdultGenres);

      expect(prompt).toContain('Gêneros adultos: []');
    });

    it('should handle only adult genres', () => {
      const adultGenres: GenreInput[] = [
        { name: 'Ecchi', isAdultContent: true },
        { name: 'Hentai', isAdultContent: true },
      ];

      const prompt = buildPrompt('Test', defaultCategories, adultGenres);

      expect(prompt).toContain('Ecchi');
      expect(prompt).toContain('Hentai');
    });
  });

  describe('validation rules', () => {
    it('should include animeType validation rules', () => {
      const prompt = buildPrompt('Test', defaultCategories, defaultGenres);

      expect(prompt).toContain('animeType');
      expect(prompt).toContain('"serie": movies=[] e seasons length>=1');
      expect(prompt).toContain('"movie": seasons=[] e movies length>=1');
      expect(prompt).toContain('"mixed": movies length>=1 e seasons length>=1');
    });

    it('should include checklist validation', () => {
      const prompt = buildPrompt('Test', defaultCategories, defaultGenres);

      expect(prompt).toContain('Checklist final');
      expect(prompt).toContain('animeType x movies/seasons');
    });

    it('should include instruction for portuguese response', () => {
      const prompt = buildPrompt('Test', defaultCategories, defaultGenres);

      expect(prompt).toContain('português');
      expect(prompt).toContain('pt-BR');
    });
  });
});
