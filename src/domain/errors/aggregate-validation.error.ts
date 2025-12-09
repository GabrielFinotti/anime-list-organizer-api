import DomainError from './domain.error.js';

export interface ValidationErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export class AggregateValidationError extends DomainError {
  public readonly errors: ValidationErrorDetail[];

  constructor(errors: ValidationErrorDetail[]) {
    const message = errors.map((e) => `${e.field ? `${e.field}: ` : ''}${e.message}`).join('; ');
    super({
      message,
      code: 'AGGREGATE_VALIDATION_ERROR',
    });
    this.name = 'AggregateValidationError';
    this.errors = errors;
  }

  public static fromDomainErrors(errors: DomainError[]): AggregateValidationError {
    return new AggregateValidationError(
      errors.map((e) => ({
        field: e.field,
        message: e.message,
        code: e.code,
      })),
    );
  }

  public get count(): number {
    return this.errors.length;
  }
}

export default AggregateValidationError;
