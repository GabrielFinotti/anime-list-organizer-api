import ApplicationError from './application.error.js';

export class ValidationError extends ApplicationError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 400);
    this.field = field;
  }
}

export default ValidationError;
