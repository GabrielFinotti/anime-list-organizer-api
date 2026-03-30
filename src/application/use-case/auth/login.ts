import { IUserRepository } from "../../../domain/repository/user.js";
import { UserLoginDTO } from "../../dto/user.js";
import { IJwtService } from "../../service/jwtService.js";

class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService,
  ) {}

  async execute(input: UserLoginDTO) {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = user.comparePassword(input.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const newAccessToken = this.jwtService.createToken(user.id.value);

    return { user, token: newAccessToken };
  }
}

export default LoginUseCase;
