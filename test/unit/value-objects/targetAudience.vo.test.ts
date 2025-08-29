import TargetAudience from '@/domain/value-object/targetAudience.vo';

describe('TargetAudience Value Object', () => {
  it('deve criar um target audience válido', () => {
    const validAudience = 'Este é um público alvo válido com mais de dez caracteres.';
    const targetAudience = TargetAudience.create(validAudience);
    expect(targetAudience.value).toBe(validAudience);
  });

  it('deve lançar erro para target audience com 10 caracteres ou menos', () => {
    const invalidAudience = 'Curto';
    expect(() => TargetAudience.create(invalidAudience)).toThrow(
      'Target audience inválido: deve ter mais de 10 caracteres e não pode ser vazio'
    );
  });

  it('deve lançar erro para target audience vazio', () => {
    const emptyAudience = '';
    expect(() => TargetAudience.create(emptyAudience)).toThrow(
      'Target audience inválido: deve ter mais de 10 caracteres e não pode ser vazio'
    );
  });

  it('deve lançar erro para target audience apenas com espaços', () => {
    const whitespaceAudience = '   ';
    expect(() => TargetAudience.create(whitespaceAudience)).toThrow(
      'Target audience inválido: deve ter mais de 10 caracteres e não pode ser vazio'
    );
  });
});
