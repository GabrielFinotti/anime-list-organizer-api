import { IUserRepository } from "../../../domain/repository/user.js";

class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    await this.userRepository.delete(id);
  }
}

export default DeleteUserUseCase;
