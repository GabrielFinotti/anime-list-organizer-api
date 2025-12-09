import { IUserRepository } from '../../../domain/repositories/user.repository.js';
import { NotFoundError } from '../../errors/index.js';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User', id);
    }

    await this.userRepository.delete(id);
  }
}

export default DeleteUserUseCase;
