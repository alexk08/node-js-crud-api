import { IncomingMessage, ServerResponse } from 'http';
import { ApiError } from './apiError';

export const onError = (
  response: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  },
  error: ApiError,
) => {
  const err = error.statusCode ? error : new ApiError('other_error');
  const { message, statusCode } = err;

  if (statusCode) {
    response.writeHead(statusCode, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: { message } }));
    return;
  }
};
