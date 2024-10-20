import { URL_PATTERN } from './constants';

export const isValidPath = (path: string) => {
  return URL_PATTERN.test(path);
};
