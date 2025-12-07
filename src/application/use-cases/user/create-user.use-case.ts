import { IUserRepository } from '../../../domain/repositories/user.repository.js';
import User from '../../../domain/entities/User.entity.js';
import { UserInputDTO, UserOutputDTO } from '../../dtos/user.dto.js';
import UserMapper from '../../mappers/user.mapper.js';
import { ConflictError } from '../../errors/index.js';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UserInputDTO): Promise<UserOutputDTO> {
    const user = User.create(input);

    const existingUser = await this.userRepository.findByEmail(user.email.value);

    if (existingUser) {
      throw new ConflictError('User', 'email', user.email.value);
    }

    const savedUser = await this.userRepository.create(user);

    return UserMapper.toResponse(savedUser);
  }
}

export default CreateUserUseCase;
