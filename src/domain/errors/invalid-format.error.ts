import DomainError, { DomainErrorParams } from './domain.error.js';

export interface InvalidFormatErrorParams extends Omit<DomainErrorParams, 'code'> {
  expectedFormat?: string;
}

export class InvalidFormatError extends DomainError {
  public readonly expectedFormat?: string;

  constructor(params: InvalidFormatErrorParams) {
    super({
      message: params.message,
      field: params.field,
      code: `INVALID_FORMAT${params.field ? `_${params.field.toUpperCase()}` : ''}`,
    });
    this.name = 'InvalidFormatError';
    this.expectedFormat = params.expectedFormat;
  }
}

export default InvalidFormatError;
