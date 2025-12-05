import { IJwtService } from '../../application/services/jwt.service.js';
import { ILookupAnimeService } from '../../application/services/lookupAnime.service.js';
import { ITokenBlacklistService } from '../../application/services/token-blacklist.service.js';
import LookupAnimeService from '../api/gpt/service/lookupAnime.service.js';
import JwtService from '../services/jwt.service.js';
import TokenBlacklistService from '../services/tokenBlacklist.service.js';
import { makeCategoryRepository, makeGenreRepository } from './repositories.factory.js';

export const makeJwtService = (): IJwtService => JwtService.getInstance();

export const makeTokenBlacklistService = (): ITokenBlacklistService =>
  TokenBlacklistService.getInstance();

export const makeLookupAnimeService = (): ILookupAnimeService =>
  new LookupAnimeService(makeCategoryRepository(), makeGenreRepository());
