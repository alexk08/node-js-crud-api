import { IncomingMessage, ServerResponse } from 'http';
import { onError } from '../errors/onError';
import { ApiError } from '../errors/apiError';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers';
import { HttpMethods } from '../types';
import { BASE_URL } from '../constants';
import { isValidPath } from '../utils';

export const router = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const { url, method } = req;

    if (method === HttpMethods.GET && url === BASE_URL) {
      return await getAllUsers(res);
    }

    if (method === HttpMethods.GET && isValidPath(url)) {
      return await getUserById(req, res);
    }

    if (method === HttpMethods.POST && url === BASE_URL) {
      return await createUser(req, res);
    }

    if (method === HttpMethods.PUT && isValidPath(url)) {
      return await updateUser(req, res);
    }

    if (method === HttpMethods.DELETE && isValidPath(url)) {
      return await deleteUser(req, res);
    }

    throw new ApiError('PAGE_NOT_FOUND');
  } catch (e) {
    onError(res, e as ApiError);
  }
};
