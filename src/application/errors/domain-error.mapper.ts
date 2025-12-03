import {
  DomainError,
  InvalidFormatError,
  InvalidValueError,
  BusinessRuleError,
  AggregateValidationError,
} from '../../domain/errors/index.js';
import { ValidationError, ValidationErrorDetail } from './validation.error.js';

export class DomainErrorMapper {
  static toValidationError(error: DomainError): ValidationError {
    if (error instanceof AggregateValidationError) {
      return new ValidationError(
        error.message,
        undefined,
        error.code,
        error.errors as ValidationErrorDetail[],
      );
    }

    if (error instanceof InvalidFormatError) {
      return new ValidationError(error.message, error.field, error.code);
    }

    if (error instanceof InvalidValueError) {
      return new ValidationError(error.message, error.field, error.code);
    }

    if (error instanceof BusinessRuleError) {
      return new ValidationError(error.message, error.field, error.code);
    }

    return new ValidationError(error.message, error.field, error.code);
  }

  static isDomainError(error: unknown): error is DomainError {
    return error instanceof DomainError;
  }
}

export default DomainErrorMapper;
