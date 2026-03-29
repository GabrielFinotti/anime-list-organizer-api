import { IUserRepository } from "../../../domain/repository/user.js";
import UserApplicationMapper from "../../mapper/user.js";

class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute() {
    const users = await this.userRepository.findAll();

    return users.map(UserApplicationMapper.toResponse);
  }
}

export default GetAllUsersUseCase;
