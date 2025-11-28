import { IUserRepository } from '../../../domain/repositories/user.repository.js';
import { UserOutputDTO, UpdateUserInputDTO } from '../../dtos/user.dto.js';
import UserMapper from '../../mappers/user.mapper.js';
import { NotFoundError, ConflictError } from '../../errors/index.js';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UpdateUserInputDTO): Promise<UserOutputDTO> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new NotFoundError('User', input.id);
    }

    if (input.email && input.email !== user.email.value) {
      const existingUser = await this.userRepository.findByEmail(input.email);

      if (existingUser) {
        throw new ConflictError('User', 'email', input.email);
      }
    }

    user.updateCommonInfo({
      username: input.username,
      email: input.email,
      password: input.password,
      biography: input.biography,
    });

    if (input.imageUrl) {
      user.updateProfileImage(input.imageUrl);
    }

    const updatedUser = await this.userRepository.update(user);

    return UserMapper.toResponse(updatedUser);
  }
}

export default UpdateUserUseCase;
