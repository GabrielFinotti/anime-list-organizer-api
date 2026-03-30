import { IUserRepository } from "../../../domain/repository/user.js";
import { UserLoginDTO } from "../../dto/user.js";

class LoginUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UserLoginDTO) {
    
  }
}

export default LoginUseCase;
