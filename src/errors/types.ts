import { HttpStatusCode } from '../types';

export type ErrorCode = HttpStatusCode.BAD_REQUEST | HttpStatusCode.NOT_FOUND | HttpStatusCode.INTERNAL_SERVER_ERROR;

export type ErrorType = 'NOT_VALID_ID' | 'USER_NOT_EXIST' | 'PAGE_NOT_FOUND' | 'MISSING_REQUIRED_FIELD' | 'OTHER_ERROR';

export interface ErrorWithCode {
  message: string;
  statusCode: ErrorCode;
}
