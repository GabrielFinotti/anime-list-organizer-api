import DomainError, { DomainErrorParams } from './domain.error.js';

export interface BusinessRuleErrorParams extends Omit<DomainErrorParams, 'code'> {
  rule: string;
}

export class BusinessRuleError extends DomainError {
  public readonly rule: string;

  constructor(params: BusinessRuleErrorParams) {
    super({
      message: params.message,
      field: params.field,
      code: `BUSINESS_RULE_${params.rule.toUpperCase().replace(/\s+/g, '_')}`,
    });
    this.name = 'BusinessRuleError';
    this.rule = params.rule;
  }
}

export default BusinessRuleError;
