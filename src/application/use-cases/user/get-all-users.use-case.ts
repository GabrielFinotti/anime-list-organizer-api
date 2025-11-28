import { IUserRepository } from '../../../domain/repositories/user.repository.js';
import { UserOutputDTO } from '../../dtos/user.dto.js';
import UserMapper from '../../mappers/user.mapper.js';

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<UserOutputDTO[]> {
    const users = await this.userRepository.findAll();

    return users.map(UserMapper.toResponse);
  }
}

export default GetAllUsersUseCase;
