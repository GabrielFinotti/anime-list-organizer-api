import { IUserRepository } from "../../../domain/repository/user.js";
import { UpdateUserProfileDTO } from "../../dto/user.js";
import UserApplicationMapper from "../../mapper/user.js";

class UpdateUserProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, input: UpdateUserProfileDTO) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    user.updateProfile(input);

    const updatedUser = await this.userRepository.update(user);

    return UserApplicationMapper.toResponse(updatedUser);
  }
}

export default UpdateUserProfileUseCase;
