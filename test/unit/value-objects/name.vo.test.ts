import Name from '@/domain/value-object/name.vo';

describe('Name Value Object', () => {
  it('deve criar um nome válido', () => {
    const validName = 'Nome Válido';
    const name = Name.create(validName);
    expect(name.value).toBe(validName.trim());
  });

  it('deve lançar erro para nome com mais de 100 caracteres', () => {
    const longName = 'a'.repeat(101);
    expect(() => Name.create(longName)).toThrow(
      'Nome inválido: deve ter no máximo 100 caracteres e não pode estar vazio'
    );
  });

  it('deve lançar erro para nome vazio', () => {
    const emptyName = '';
    expect(() => Name.create(emptyName)).toThrow(
      'Nome inválido: deve ter no máximo 100 caracteres e não pode estar vazio'
    );
  });

  it('deve lançar erro para nome apenas com espaços', () => {
    const whitespaceName = '   ';
    expect(() => Name.create(whitespaceName)).toThrow(
      'Nome inválido: deve ter no máximo 100 caracteres e não pode estar vazio'
    );
  });

  it('deve normalizar o nome removendo espaços extras', () => {
    const nameWithSpaces = '  Nome com espaços  ';
    const name = Name.create(nameWithSpaces);
    expect(name.value).toBe('Nome com espaços');
  });
});
