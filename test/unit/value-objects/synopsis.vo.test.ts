import Synopsis from '@/domain/value-object/synopsis.vo';

describe('Synopsis Value Object', () => {
  it('deve criar uma sinopse válida', () => {
    const validSynopsis = 'Esta é uma sinopse válida com pelo menos dez caracteres.';
    const synopsis = Synopsis.create(validSynopsis);
    expect(synopsis.value).toBe(validSynopsis.trim());
  });

  it('deve lançar erro para sinopse com menos de 10 caracteres', () => {
    const invalidSynopsis = 'Curto';
    expect(() => Synopsis.create(invalidSynopsis)).toThrow(
      'Sinopse inválida. Deve ter no mínimo 10 caracteres e não pode estar vazia'
    );
  });

  it('deve lançar erro para sinopse vazia', () => {
    const emptySynopsis = '';
    expect(() => Synopsis.create(emptySynopsis)).toThrow(
      'Sinopse inválida. Deve ter no mínimo 10 caracteres e não pode estar vazia'
    );
  });

  it('deve lançar erro para sinopse apenas com espaços', () => {
    const whitespaceSynopsis = '   ';
    expect(() => Synopsis.create(whitespaceSynopsis)).toThrow(
      'Sinopse inválida. Deve ter no mínimo 10 caracteres e não pode estar vazia'
    );
  });

  it('deve normalizar a sinopse removendo espaços extras', () => {
    const synopsisWithSpaces = '  Sinopse com espaços  ';
    const synopsis = Synopsis.create(synopsisWithSpaces);
    expect(synopsis.value).toBe('Sinopse com espaços');
  });
});
