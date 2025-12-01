import { IUserRepository } from '../../../domain/repositories/user.repository.js';
import { IJwtService } from '../../services/jwt.service.interface.js';
import { LoginInputDTO, LoginOutputDTO } from '../../dtos/auth.dto.js';
import { UnauthorizedError } from '../../errors/unauthorized.error.js';

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService,
  ) {}

  async execute(input: LoginInputDTO): Promise<LoginOutputDTO> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = user.password.comparePassword(input.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = this.jwtService.generateToken({
      userId: user.id.value,
      email: user.email.value,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id.value,
        email: user.email.value,
        username: user.username.value,
        imageUrl: user.imageUrl.value,
        role: user.role,
      },
    };
  }
}

export default LoginUseCase;
