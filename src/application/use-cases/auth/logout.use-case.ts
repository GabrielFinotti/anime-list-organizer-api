import { IJwtService } from '../../services/jwt.service.interface.js';
import { ITokenBlacklistService } from '../../services/token-blacklist.service.interface.js';
import { LogoutInputDTO } from '../../dtos/auth.dto.js';

export class LogoutUseCase {
  constructor(
    private readonly jwtService: IJwtService,
    private readonly tokenBlacklistService: ITokenBlacklistService,
  ) {}

  async execute(input: LogoutInputDTO): Promise<void> {
    const remainingTTL = this.jwtService.getTokenRemainingTTL(input.token);

    if (remainingTTL > 0) {
      await this.tokenBlacklistService.addToBlacklist(input.token, remainingTTL);
    }
  }
}

export default LogoutUseCase;
