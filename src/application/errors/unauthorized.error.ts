import { ApplicationError } from './application.error.js';

export class UnauthorizedError extends ApplicationError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UnauthorizedError');
  }
}

export default UnauthorizedError;
