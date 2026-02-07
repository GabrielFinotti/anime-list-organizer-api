import { Request, Response, NextFunction } from 'express';
import UnauthorizedError from '../../../application/errors/unauthorized.error.js';

const roleMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRole = req.userRole;

    if (userRole !== 'admin') {
      throw new UnauthorizedError('Admin role required to access this resource');
    }
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);

      return;
    }

    next(new UnauthorizedError('Authorization failed'));
  }
};

export default roleMiddleware;
