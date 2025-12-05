import { Request, Response, NextFunction, RequestHandler } from 'express';
import { IJwtService } from '../../../application/services/jwt.service.js';
import { ITokenBlacklistService } from '../../../application/services/token-blacklist.service.js';
import { UnauthorizedError } from '../../../application/errors/unauthorized.error.js';
import '../../types/express.type.js';

export const makeAuthMiddleware = (
  jwtService: IJwtService,
  tokenBlacklistService: ITokenBlacklistService,
): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedError('Authorization header is required');
      }

      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedError('Invalid authorization format. Use: Bearer <token>');
      }

      const isBlacklisted = await tokenBlacklistService.isBlacklisted(token);

      if (isBlacklisted) {
        throw new UnauthorizedError('Token has been revoked');
      }

      const payload = jwtService.verifyToken(token);

      req.userId = payload.userId;
      req.userRole = payload.role;

      next();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        next(error);

        return;
      }

      if (error instanceof Error) {
        next(new UnauthorizedError(error.message));

        return;
      }

      next(new UnauthorizedError('Authentication failed'));
    }
  };
};
