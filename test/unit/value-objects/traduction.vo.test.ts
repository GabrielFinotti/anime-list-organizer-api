import Traduction from '@/domain/value-object/traduction.vo';

describe('Traduction Value Object', () => {
  it('deve criar uma tradução válida', () => {
    const validTraduction = 'Tradução válida';
    const traduction = Traduction.create(validTraduction);
    expect(traduction.value).toBe(validTraduction);
  });

  it('deve lançar erro para tradução com menos de 5 caracteres', () => {
    const invalidTraduction = 'Cur';
    expect(() => Traduction.create(invalidTraduction)).toThrow(
      'Tradução inválida: deve ter no mínimo 5 caracteres e não pode ser vazia'
    );
  });

  it('deve lançar erro para tradução vazia', () => {
    const emptyTraduction = '';
    expect(() => Traduction.create(emptyTraduction)).toThrow(
      'Tradução inválida: deve ter no mínimo 5 caracteres e não pode ser vazia'
    );
  });

  it('deve lançar erro para tradução apenas com espaços', () => {
    const whitespaceTraduction = '   ';
    expect(() => Traduction.create(whitespaceTraduction)).toThrow(
      'Tradução inválida: deve ter no mínimo 5 caracteres e não pode ser vazia'
    );
  });
});
