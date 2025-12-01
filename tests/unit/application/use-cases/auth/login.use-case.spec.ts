import { LoginUseCase } from '../../../../../src/application/use-cases/auth/login.use-case';
import { IUserRepository } from '../../../../../src/domain/repositories/user.repository';
import { IJwtService, TokenPayload } from '../../../../../src/application/services/jwt.service.interface';
import { UnauthorizedError } from '../../../../../src/application/errors/unauthorized.error';
import User from '../../../../../src/domain/entities/User.entity';
import Password from '../../../../../src/domain/value-objects/password.value-object';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockJwtService: jest.Mocked<IJwtService>;

  const createMockUser = (overrides: Partial<{ email: string; password: string }> = {}) => {
    const user = User.create({
      imageUrl: 'https://example.com/image.png',
      username: 'testuser',
      email: overrides.email ?? 'test@example.com',
      password: overrides.password ?? 'Test@123',
      biography: 'Test biography',
      role: 'user',
    });

    return user;
  };

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockJwtService = {
      generateToken: jest.fn(),
      verifyToken: jest.fn(),
      getTokenRemainingTTL: jest.fn(),
    } as unknown as jest.Mocked<IJwtService>;

    useCase = new LoginUseCase(mockUserRepository, mockJwtService);
  });

  describe('execute', () => {
    it('should login successfully with valid credentials', async () => {
      const input = {
        email: 'test@example.com',
        password: 'Test@123',
      };

      const mockUser = createMockUser({ email: input.email, password: input.password });
      const expectedToken = 'generated-jwt-token';

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockJwtService.generateToken.mockReturnValue(expectedToken);

      const result = await useCase.execute(input);

      expect(result.accessToken).toBe(expectedToken);
      expect(result.user.email).toBe(input.email);
      expect(result.user.username).toBe('testuser');
      expect(result.user.role).toBe('user');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(mockJwtService.generateToken).toHaveBeenCalledWith({
        userId: mockUser.id.value,
        email: mockUser.email.value,
        role: mockUser.role,
      });
    });

    it('should throw UnauthorizedError when user is not found', async () => {
      const input = {
        email: 'nonexistent@example.com',
        password: 'Test@123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(useCase.execute(input)).rejects.toThrow(UnauthorizedError);
      await expect(useCase.execute(input)).rejects.toThrow('Invalid email or password');
      expect(mockJwtService.generateToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedError when password is invalid', async () => {
      const input = {
        email: 'test@example.com',
        password: 'WrongPassword@123',
      };

      const mockUser = createMockUser({ email: input.email, password: 'CorrectPassword@123' });
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(useCase.execute(input)).rejects.toThrow(UnauthorizedError);
      await expect(useCase.execute(input)).rejects.toThrow('Invalid email or password');
      expect(mockJwtService.generateToken).not.toHaveBeenCalled();
    });

    it('should return user data without sensitive information', async () => {
      const input = {
        email: 'test@example.com',
        password: 'Test@123',
      };

      const mockUser = createMockUser({ email: input.email, password: input.password });
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockJwtService.generateToken.mockReturnValue('token');

      const result = await useCase.execute(input);

      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('email');
      expect(result.user).toHaveProperty('username');
      expect(result.user).toHaveProperty('imageUrl');
      expect(result.user).toHaveProperty('role');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should generate token with correct payload for admin user', async () => {
      const adminUser = User.create({
        imageUrl: 'https://example.com/admin.png',
        username: 'adminuser',
        email: 'admin@example.com',
        password: 'Admin@123',
        biography: 'Admin biography',
        role: 'admin',
      });

      const input = {
        email: 'admin@example.com',
        password: 'Admin@123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(adminUser);
      mockJwtService.generateToken.mockReturnValue('admin-token');

      await useCase.execute(input);

      expect(mockJwtService.generateToken).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'admin',
        }),
      );
    });
  });
});
