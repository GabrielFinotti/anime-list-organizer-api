import { IUserRepository } from "../../../domain/repository/user.js";
import { UpdateUserRoleDTO } from "../../dto/user.js";
import UserApplicationMapper from "../../mapper/user.js";

class UpdateUserRoleUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, input: UpdateUserRoleDTO) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    user.updateRole(input.role);

    const updatedUser = await this.userRepository.update(user);

    return UserApplicationMapper.toResponse(updatedUser);
  }
}

export default UpdateUserRoleUseCase;
