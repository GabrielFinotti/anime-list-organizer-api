import { IUserRepository } from "../../../domain/repository/user.js";
import { UpdateUserAccountDTO } from "../../dto/user.js";
import UserApplicationMapper from "../../mapper/user.js";

class UpdateUserAccountUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, input: UpdateUserAccountDTO) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    user.updateAccount(input);

    const updatedUser = await this.userRepository.update(user);

    return UserApplicationMapper.toResponse(updatedUser);
  }
}

export default UpdateUserAccountUseCase;
