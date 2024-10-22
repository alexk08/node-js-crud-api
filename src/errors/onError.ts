import { ServerResponse } from 'http';
import { ApiError } from './apiError';
import { BASE_HEADERS } from '../constants';

export const onError = (response: ServerResponse, error: ApiError) => {
  const err = error.statusCode ? error : new ApiError('OTHER_ERROR');
  const { message, statusCode } = err;
  if (!statusCode) return;
  response.writeHead(statusCode, BASE_HEADERS);
  response.end(JSON.stringify({ error: { message } }));
};
