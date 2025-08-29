import Password from '@/domain/value-object/password.vo';

describe('Password Value Object', () => {
  it('deve criar uma senha válida', () => {
    const validPassword = 'Senha123!';
    const password = Password.create(validPassword);
    expect(password.value).toBe(validPassword);
  });

  it('deve lançar erro para senha sem letra', () => {
    const invalidPassword = '12345678!';
    expect(() => Password.create(invalidPassword)).toThrow(
      'Senha inválida: deve conter pelo menos uma letra, um número e um caractere especial e ter entre 8 e 20 caracteres.'
    );
  });

  it('deve lançar erro para senha sem número', () => {
    const invalidPassword = 'Senhaaaaa!';
    expect(() => Password.create(invalidPassword)).toThrow(
      'Senha inválida: deve conter pelo menos uma letra, um número e um caractere especial e ter entre 8 e 20 caracteres.'
    );
  });

  it('deve lançar erro para senha sem caractere especial', () => {
    const invalidPassword = 'Senha1234';
    expect(() => Password.create(invalidPassword)).toThrow(
      'Senha inválida: deve conter pelo menos uma letra, um número e um caractere especial e ter entre 8 e 20 caracteres.'
    );
  });

  it('deve lançar erro para senha com menos de 8 caracteres', () => {
    const shortPassword = 'Sen1!';
    expect(() => Password.create(shortPassword)).toThrow(
      'Senha inválida: deve conter pelo menos uma letra, um número e um caractere especial e ter entre 8 e 20 caracteres.'
    );
  });

  it('deve lançar erro para senha com mais de 20 caracteres', () => {
    const longPassword = 'SenhaMuitoLongaComNumeros123!';
    expect(() => Password.create(longPassword)).toThrow(
      'Senha inválida: deve conter pelo menos uma letra, um número e um caractere especial e ter entre 8 e 20 caracteres.'
    );
  });
});
