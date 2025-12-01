import { Request, Response, NextFunction } from 'express';
import JwtService from '../../../infrastructure/services/jwt.service.js';
import TokenBlacklistService from '../../../infrastructure/services/tokenBlacklist.service.js';
import { UnauthorizedError } from '../../../application/errors/unauthorized.error.js';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: 'user' | 'admin';
    }
  }
}

const authMiddleware = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('Authorization header is required');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedError('Invalid authorization format. Use: Bearer <token>');
    }

    const tokenBlacklistService = TokenBlacklistService.getInstance();
    const isBlacklisted = await tokenBlacklistService.isBlacklisted(token);

    if (isBlacklisted) {
      throw new UnauthorizedError('Token has been revoked');
    }

    const jwtService = JwtService.getInstance();
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

export default authMiddleware;
