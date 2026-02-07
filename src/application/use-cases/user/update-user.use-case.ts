import { IUserRepository } from '../../../domain/repositories/user.repository.js';
import { UserOutputDTO, UpdateUserInputDTO } from '../../dtos/user.dto.js';
import UserMapper from '../../mappers/user.mapper.js';
import { NotFoundError, ConflictError } from '../../errors/index.js';
import Email from '../../../domain/value-objects/email.value-object.js';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UpdateUserInputDTO): Promise<UserOutputDTO> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new NotFoundError('User', input.id);
    }

    if (input.email) {
      const email = Email.create(input.email);

      const existingUser = await this.userRepository.findByEmail(email.value);

      if (existingUser && !existingUser.id.equals(user.id)) {
        throw new ConflictError('User', 'email', email.value);
      }
    }

    user.updateCommonInfo(input);

    if (input.imageUrl) {
      user.updateProfileImage(input.imageUrl);
    }

    const updatedUser = await this.userRepository.update(user);

    return UserMapper.toResponse(updatedUser);
  }
}

export default UpdateUserUseCase;
