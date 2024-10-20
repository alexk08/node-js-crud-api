import { ErrorType, ErrorWithCode, StatusCode } from './types';

export class ApiError extends Error {
  statusCode: StatusCode | undefined;

  constructor(errorType: ErrorType) {
    super();
    this.name = 'ApiError';
    const { message, statusCode } = this.mapError(errorType);
    this.statusCode = statusCode;
    this.message = message;
  }

  private mapError(errorType: ErrorType): ErrorWithCode {
    return MAP_ERROR[errorType];
  }
}

const MAP_ERROR: { [key in ErrorType]: ErrorWithCode } = {
  not_valid_id: { message: 'Not valid id', statusCode: 400 },
  missing_required_field: { message: 'Missing required field', statusCode: 400 },
  user_not_exist: { message: 'User does not exist', statusCode: 404 },
  page_not_found: { message: 'Page not found', statusCode: 404 },
  other_error: { message: 'Something went wrong', statusCode: 500 },
};
