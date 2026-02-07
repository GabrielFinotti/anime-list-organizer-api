export interface DomainErrorParams {
  message: string;
  field?: string;
  code?: string;
}

export class DomainError extends Error {
  public readonly field?: string;
  public readonly code?: string;

  constructor(params: DomainErrorParams) {
    super(params.message);
    this.name = 'DomainError';
    this.field = params.field;
    this.code = params.code;
  }
}

export default DomainError;
