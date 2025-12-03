import ApplicationError from './application.error.js';

export interface ValidationErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export class ValidationError extends ApplicationError {
  public readonly field?: string;
  public readonly code?: string;
  public readonly errors?: ValidationErrorDetail[];

  constructor(message: string, field?: string, code?: string, errors?: ValidationErrorDetail[]) {
    super(message, 400);
    this.field = field;
    this.code = code;
    this.errors = errors;
  }
}

export default ValidationError;
