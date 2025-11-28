import { UpdateUserUseCase } from '../../../../../src/application/use-cases/user/update-user.use-case.js';
import { IUserRepository } from '../../../../../src/domain/repositories/user.repository.js';
import { NotFoundError, ConflictError } from '../../../../../src/application/errors/index.js';
import User from '../../../../../src/domain/entities/User.entity.js';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
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

    useCase = new UpdateUserUseCase(userRepository);
  });

  it('deve atualizar o username do usuário com sucesso', async () => {
    const user = createMockUser();
    const updateInput = {
      id: user.id.value,
      username: 'newusername',
    };

    userRepository.findById.mockResolvedValue(user);
    userRepository.update.mockImplementation(async (u) => u);

    const result = await useCase.execute(updateInput);

    expect(userRepository.findById).toHaveBeenCalledWith(updateInput.id);
    expect(userRepository.update).toHaveBeenCalled();
    expect(result.username).toBe('newusername');
  });

  it('deve atualizar o email do usuário com sucesso', async () => {
    const user = createMockUser();
    const updateInput = {
      id: user.id.value,
      email: 'newemail@example.com',
    };

    userRepository.findById.mockResolvedValue(user);
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.update.mockImplementation(async (u) => u);

    const result = await useCase.execute(updateInput);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(updateInput.email);
    expect(result.email).toBe('newemail@example.com');
  });

  it('deve atualizar a imagem de perfil do usuário', async () => {
    const user = createMockUser();
    const updateInput = {
      id: user.id.value,
      imageUrl: 'https://example.com/new-avatar.jpg',
    };

    userRepository.findById.mockResolvedValue(user);
    userRepository.update.mockImplementation(async (u) => u);

    const result = await useCase.execute(updateInput);

    expect(result.imageUrl).toBe('https://example.com/new-avatar.jpg');
  });

  it('deve lançar NotFoundError quando o usuário não existir', async () => {
    const updateInput = {
      id: 'non-existent-id',
      username: 'newname',
    };

    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(updateInput)).rejects.toThrow(NotFoundError);
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('deve lançar ConflictError quando o novo email já existe', async () => {
    const user = createMockUser();
    const existingUser = User.create({
      imageUrl: 'https://example.com/other.jpg',
      username: 'otheruser',
      email: 'existing@example.com',
      password: 'Pass@456',
      biography: 'Other user',
      role: 'user',
    });

    const updateInput = {
      id: user.id.value,
      email: 'existing@example.com',
    };

    userRepository.findById.mockResolvedValue(user);
    userRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(updateInput)).rejects.toThrow(ConflictError);
    expect(userRepository.update).not.toHaveBeenCalled();
  });
});
