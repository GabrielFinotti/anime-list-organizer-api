import ReleaseDate from '@/domain/value-object/releaseDate.vo';

describe('ReleaseDate Value Object', () => {
  it('deve criar uma data de lançamento válida a partir de Date', () => {
    const validDate = new Date('2023-01-01');
    const releaseDate = ReleaseDate.create(validDate);
    expect(releaseDate.value).toEqual(validDate);
  });

  it('deve criar uma data de lançamento válida a partir de string', () => {
    const validDateString = '2023-01-01';
    const releaseDate = ReleaseDate.create(validDateString);
    expect(releaseDate.value).toEqual(new Date(validDateString));
  });

  it('deve lançar erro para data inválida', () => {
    const invalidDate = 'invalid-date';
    expect(() => ReleaseDate.create(invalidDate)).toThrow('Data inválida');
  });

  it('deve lançar erro para string que não representa uma data válida', () => {
    const invalidDate = 'not-a-date';
    expect(() => ReleaseDate.create(invalidDate)).toThrow('Data inválida');
  });
});
