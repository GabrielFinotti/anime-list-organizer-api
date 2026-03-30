import { IUserRepository } from "../../../domain/repository/user.js";
import UserApplicationMapper from "../../mapper/user.js";

class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return UserApplicationMapper.toResponse(user);
  }
}

export default GetUserUseCase;
