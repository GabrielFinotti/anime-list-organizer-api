import { CreateUserUseCase } from '../../../../../src/application/use-cases/user/create-user.use-case.js';
import { IUserRepository } from '../../../../../src/domain/repositories/user.repository.js';
import { ConflictError } from '../../../../../src/application/errors/index.js';
import User from '../../../../../src/domain/entities/User.entity.js';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  const validUserInput = {
    imageUrl: 'https://example.com/avatar.jpg',
    username: 'testuser',
    email: 'test@example.com',
    password: 'Pass@123',
    biography: 'Test biography',
    role: 'user' as const,
  };

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateUserUseCase(userRepository);
  });

  it('deve criar um usuário com sucesso', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockImplementation(async (user) => user);

    const result = await useCase.execute(validUserInput);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(validUserInput.email);
    expect(userRepository.create).toHaveBeenCalled();
    expect(result.username).toBe(validUserInput.username);
    expect(result.email).toBe(validUserInput.email);
  });

  it('deve lançar ConflictError quando o email já existe', async () => {
    const existingUser = User.create({
      imageUrl: 'https://example.com/other.jpg',
      username: 'existinguser',
      email: validUserInput.email,
      password: 'Pass@456',
      biography: 'Existing user',
      role: 'user',
    });

    userRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(validUserInput)).rejects.toThrow(ConflictError);
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});
