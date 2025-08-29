import Description from '@/domain/value-object/description.vo';

describe('Description Value Object', () => {
  it('deve criar uma descrição válida', () => {
    const validDescription = 'Esta é uma descrição válida com pelo menos dez caracteres.';
    const description = Description.create(validDescription);
    expect(description.value).toBe(validDescription.trim());
  });

  it('deve lançar erro para descrição com menos de 10 caracteres', () => {
    const invalidDescription = 'Curto';
    expect(() => Description.create(invalidDescription)).toThrow(
      'Descrição inválida: deve ter pelo menos 10 caracteres e não pode estar vazia'
    );
  });

  it('deve lançar erro para descrição vazia', () => {
    const emptyDescription = '';
    expect(() => Description.create(emptyDescription)).toThrow(
      'Descrição inválida: deve ter pelo menos 10 caracteres e não pode estar vazia'
    );
  });

  it('deve lançar erro para descrição apenas com espaços', () => {
    const whitespaceDescription = '   ';
    expect(() => Description.create(whitespaceDescription)).toThrow(
      'Descrição inválida: deve ter pelo menos 10 caracteres e não pode estar vazia'
    );
  });

  it('deve normalizar a descrição removendo espaços extras', () => {
    const descriptionWithSpaces = '  Descrição com espaços  ';
    const description = Description.create(descriptionWithSpaces);
    expect(description.value).toBe('Descrição com espaços');
  });
});
