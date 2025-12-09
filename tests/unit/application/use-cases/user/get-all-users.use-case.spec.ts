import { GetAllUsersUseCase } from '../../../../../src/application/use-cases/user/get-all-users.use-case.js';
import { IUserRepository } from '../../../../../src/domain/repositories/user.repository.js';
import User from '../../../../../src/domain/entities/User.entity.js';

describe('GetAllUsersUseCase', () => {
  let useCase: GetAllUsersUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  const createMockUser = (username: string, email: string) =>
    User.create({
      imageUrl: 'https://example.com/avatar.jpg',
      username,
      email,
      password: 'Pass@123',
      biography: 'Test biography',
      role: 'user',
    });

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new GetAllUsersUseCase(userRepository);
  });

  it('deve retornar todos os usuários', async () => {
    const users = [
      createMockUser('user1', 'user1@example.com'),
      createMockUser('user2', 'user2@example.com'),
    ];

    userRepository.findAll.mockResolvedValue(users);

    const result = await useCase.execute();

    expect(userRepository.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].username).toBe('user1');
    expect(result[1].username).toBe('user2');
  });

  it('deve retornar lista vazia quando não houver usuários', async () => {
    userRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
