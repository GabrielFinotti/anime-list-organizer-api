import ObjectId from '@/domain/value-object/objectId.vo';

describe('ObjectId Value Object', () => {
  it('deve criar um ObjectId válido', () => {
    const validId = '507f1f77bcf86cd799439011';
    const objectId = ObjectId.create(validId);
    expect(objectId.value).toBe(validId);
  });

  it('deve lançar erro para ObjectId inválido', () => {
    const invalidId = 'invalid';
    expect(() => ObjectId.create(invalidId)).toThrow(
      'ObjectId inválido: deve ter 24 caracteres hexadecimais'
    );
  });

  it('deve lançar erro para ObjectId com menos de 24 caracteres', () => {
    const shortId = '507f1f77bcf86cd79943901';
    expect(() => ObjectId.create(shortId)).toThrow(
      'ObjectId inválido: deve ter 24 caracteres hexadecimais'
    );
  });

  it('deve lançar erro para ObjectId com caracteres não hexadecimais', () => {
    const nonHexId = '507f1f77bcf86cd79943901g';
    expect(() => ObjectId.create(nonHexId)).toThrow(
      'ObjectId inválido: deve ter 24 caracteres hexadecimais'
    );
  });

  it('deve aceitar ObjectId criado a partir de string numérica', () => {
    const stringId = '123456789012345678901234';
    const objectId = ObjectId.create(stringId);
    expect(objectId.value).toBe(stringId);
  });
});
