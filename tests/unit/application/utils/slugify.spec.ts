import slugify from '../../../../src/application/utils/slugify';

describe('slugify', () => {
  describe('basic transformations', () => {
    it('should convert string to lowercase', () => {
      expect(slugify('HELLO WORLD')).toBe('hello-world');
    });

    it('should replace spaces with dashes', () => {
      expect(slugify('hello world')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('hello   world')).toBe('hello-world');
    });

    it('should trim leading and trailing spaces', () => {
      expect(slugify('  hello world  ')).toBe('hello-world');
    });
  });

  describe('special characters handling', () => {
    it('should remove accents and diacritics', () => {
      expect(slugify('Café résumé')).toBe('cafe-resume');
    });

    it('should remove Japanese/special unicode chars', () => {
      expect(slugify('Naruto ナルト')).toBe('naruto');
    });

    it('should remove punctuation marks', () => {
      expect(slugify('hello, world!')).toBe('hello-world');
    });

    it('should remove special symbols', () => {
      expect(slugify('hello@world#test$')).toBe('helloworldtest');
    });

    it('should handle Portuguese characters', () => {
      expect(slugify('São Paulo')).toBe('sao-paulo');
      expect(slugify('Açaí')).toBe('acai');
      expect(slugify('Ação')).toBe('acao');
    });
  });

  describe('dash handling', () => {
    it('should collapse multiple dashes', () => {
      expect(slugify('hello---world')).toBe('hello-world');
    });

    it('should remove leading dashes', () => {
      expect(slugify('---hello')).toBe('hello');
    });

    it('should remove trailing dashes', () => {
      expect(slugify('hello---')).toBe('hello');
    });

    it('should keep dashes between words', () => {
      expect(slugify('hello-world')).toBe('hello-world');
    });
  });

  describe('numbers', () => {
    it('should keep numbers', () => {
      expect(slugify('hello123world')).toBe('hello123world');
    });

    it('should handle anime names with numbers', () => {
      expect(slugify('One Piece 2')).toBe('one-piece-2');
    });

    it('should handle year in name', () => {
      expect(slugify('Dragon Ball Z 1989')).toBe('dragon-ball-z-1989');
    });
  });

  describe('edge cases', () => {
    it('should return empty string for undefined', () => {
      expect(slugify(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(slugify('')).toBe('');
    });

    it('should return empty string for only spaces', () => {
      expect(slugify('   ')).toBe('');
    });

    it('should return empty string for only special chars', () => {
      expect(slugify('!!!@@@###')).toBe('');
    });
  });

  describe('real anime names', () => {
    it('should slugify "Shingeki no Kyojin"', () => {
      expect(slugify('Shingeki no Kyojin')).toBe('shingeki-no-kyojin');
    });

    it('should slugify "Jujutsu Kaisen"', () => {
      expect(slugify('Jujutsu Kaisen')).toBe('jujutsu-kaisen');
    });

    it('should slugify "Kimetsu no Yaiba: Mugen Train"', () => {
      expect(slugify('Kimetsu no Yaiba: Mugen Train')).toBe('kimetsu-no-yaiba-mugen-train');
    });

    it('should slugify "Re:Zero"', () => {
      expect(slugify('Re:Zero')).toBe('rezero');
    });

    it('should slugify "Steins;Gate"', () => {
      expect(slugify('Steins;Gate')).toBe('steinsgate');
    });
  });
});
