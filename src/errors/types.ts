export type StatusCode = 400 | 404 | 500;

export type ErrorType = 'not_valid_id' | 'user_not_exist' | 'page_not_found' | 'missing_required_field' | 'other_error';

export interface ErrorWithCode {
  message: string;
  statusCode: StatusCode;
}
