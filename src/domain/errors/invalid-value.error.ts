import DomainError, { DomainErrorParams } from './domain.error.js';

export interface InvalidValueErrorParams extends Omit<DomainErrorParams, 'code'> {
  min?: number;
  max?: number;
  allowedValues?: string[];
}

export class InvalidValueError extends DomainError {
  public readonly min?: number;
  public readonly max?: number;
  public readonly allowedValues?: string[];

  constructor(params: InvalidValueErrorParams) {
    super({
      message: params.message,
      field: params.field,
      code: `INVALID_VALUE${params.field ? `_${params.field.toUpperCase()}` : ''}`,
    });
    this.name = 'InvalidValueError';
    this.min = params.min;
    this.max = params.max;
    this.allowedValues = params.allowedValues;
  }
}

export default InvalidValueError;
