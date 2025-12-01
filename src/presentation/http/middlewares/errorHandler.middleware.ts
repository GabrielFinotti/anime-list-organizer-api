import { Request, Response, NextFunction } from 'express';
import ApplicationError from '../../../application/errors/application.error.js';

const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ApplicationError) {
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
    });

    return;
  }

  console.error('Unexpected error:', error);

  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
  });
};

export default errorHandler;
