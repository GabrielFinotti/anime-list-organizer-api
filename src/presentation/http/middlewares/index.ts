import {
  makeJwtService,
  makeTokenBlacklistService,
} from '../../../infrastructure/factories/services.factory.js';
import { makeAuthMiddleware } from './auth.middleware.js';

export const authMiddleware = makeAuthMiddleware(makeJwtService(), makeTokenBlacklistService());

export { default as errorHandler } from './errorHandler.middleware.js';
export { default as roleMiddleware } from './role.middleware.js';
