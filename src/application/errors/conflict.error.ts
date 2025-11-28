import ApplicationError from './application.error.js';

export class ConflictError extends ApplicationError {
  constructor(resource: string, field: string, value: string) {
    super(`${resource} with ${field} '${value}' already exists`, 409);
  }
}

export default ConflictError;
