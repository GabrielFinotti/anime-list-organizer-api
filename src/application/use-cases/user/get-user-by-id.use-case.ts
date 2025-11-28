import { IUserRepository } from '../../../domain/repositories/user.repository.js';
import { UserOutputDTO } from '../../dtos/user.dto.js';
import UserMapper from '../../mappers/user.mapper.js';
import { NotFoundError } from '../../errors/index.js';

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserOutputDTO> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User', id);
    }

    return UserMapper.toResponse(user);
  }
}

export default GetUserByIdUseCase;
