import { IJwtService } from '../../application/services/jwt.service.interface.js';
import { ITokenBlacklistService } from '../../application/services/token-blacklist.service.interface.js';
import JwtService from '../services/jwt.service.js';
import TokenBlacklistService from '../services/tokenBlacklist.service.js';

export const makeJwtService = (): IJwtService => JwtService.getInstance();

export const makeTokenBlacklistService = (): ITokenBlacklistService =>
  TokenBlacklistService.getInstance();
