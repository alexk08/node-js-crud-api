import { IncomingMessage } from 'http';
import { URL_PATTERN } from './constants';
import { BaseUser } from './types';

export const isValidPath = (path: string | undefined) => {
  return !!path && URL_PATTERN.test(path);
};

export const isValidUser = ({ hobbies, age, username }: BaseUser) => {
  return typeof age === 'number' && typeof username === 'string' && Array.isArray(hobbies);
};

export const parseBody = (req: IncomingMessage) => {
  return new Promise<BaseUser>((resolve, reject) => {
    let body = '';

    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const user = JSON.parse(body);
        resolve(user);
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', err => {
      reject(err);
    });
  });
};
