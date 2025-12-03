import { Request, Response, NextFunction } from 'express';
import ApplicationError from '../../../application/errors/application.error.js';
import { ValidationError } from '../../../application/errors/validation.error.js';
import { DomainErrorMapper } from '../../../application/errors/domain-error.mapper.js';
import { DomainError } from '../../../domain/errors/index.js';

interface ErrorResponse {
  error: string;
  message: string;
  field?: string;
  code?: string;
  errors?: Array<{
    field?: string;
    message: string;
    code?: string;
  }>;
}

const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (DomainErrorMapper.isDomainError(error)) {
    const validationError = DomainErrorMapper.toValidationError(error as DomainError);
    const response: ErrorResponse = {
      error: validationError.name,
      message: validationError.message,
    };

    if (validationError.field) response.field = validationError.field;
    if (validationError.code) response.code = validationError.code;
    if (validationError.errors) response.errors = validationError.errors;

    res.status(validationError.statusCode).json(response);
    
    return;
  }

  if (error instanceof ApplicationError) {
    const response: ErrorResponse = {
      error: error.name,
      message: error.message,
    };

    if (error instanceof ValidationError) {
      if (error.field) response.field = error.field;
      if (error.code) response.code = error.code;
      if (error.errors) response.errors = error.errors;
    }

    res.status(error.statusCode).json(response);

    return;
  }

  console.error('Unexpected error:', error);

  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
  });
};

export default errorHandler;
