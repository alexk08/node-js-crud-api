import { ErrorType, ErrorWithCode, ErrorCode } from './types';

export class ApiError extends Error {
  statusCode: ErrorCode | undefined;

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

export const MAP_ERROR: { [key in ErrorType]: ErrorWithCode } = {
  NOT_VALID_ID: { message: 'Not valid id', statusCode: 400 },
  MISSING_REQUIRED_FIELD: { message: 'A required field is missing or the value type does not match', statusCode: 400 },
  USER_NOT_EXIST: { message: 'User does not exist', statusCode: 404 },
  PAGE_NOT_FOUND: { message: 'Page not found', statusCode: 404 },
  OTHER_ERROR: { message: 'Something went wrong', statusCode: 500 },
};
