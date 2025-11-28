import { DeleteUserUseCase } from '../../../../../src/application/use-cases/user/delete-user.use-case.js';
import { IUserRepository } from '../../../../../src/domain/repositories/user.repository.js';
import { NotFoundError } from '../../../../../src/application/errors/index.js';
import User from '../../../../../src/domain/entities/User.entity.js';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  const createMockUser = () =>
    User.create({
      imageUrl: 'https://example.com/avatar.jpg',
      username: 'testuser',
      email: 'test@example.com',
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

    useCase = new DeleteUserUseCase(userRepository);
  });

  it('deve deletar um usuário com sucesso', async () => {
    const user = createMockUser();

    userRepository.findById.mockResolvedValue(user);
    userRepository.delete.mockResolvedValue();

    await useCase.execute(user.id.value);

    expect(userRepository.findById).toHaveBeenCalledWith(user.id.value);
    expect(userRepository.delete).toHaveBeenCalledWith(user.id.value);
  });

  it('deve lançar NotFoundError quando o usuário não existir', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent-id')).rejects.toThrow(NotFoundError);
    expect(userRepository.delete).not.toHaveBeenCalled();
  });
});
