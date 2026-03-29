import User from "../../../domain/entity/User.js";
import { IUserRepository } from "../../../domain/repository/user.js";
import { UserInputDTO } from "../../dto/user.js";
import UserApplicationMapper from "../../mapper/user.js";

class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UserInputDTO) {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = User.create({
      username: input.username,
      email: input.email,
      password: input.password,
      phoneNumber: input.phoneNumber,
      dateOfBirth: input.dateOfBirth,
      role: input.role || "user",
    });

    await this.userRepository.create(user);

    return UserApplicationMapper.toResponse(user);
  }
}

export default CreateUserUseCase;
