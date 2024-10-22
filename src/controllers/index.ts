import { IncomingMessage, ServerResponse } from 'http';
import { UsersService } from '../services/usersService';
import { HttpStatusCode } from '../types';
import { BASE_HEADERS, BASE_URL } from '../constants';
import { parseBody } from '../utils';
import { onError } from '../errors/onError';
import { ApiError } from '../errors/apiError';

const usersService = new UsersService();

export const getAllUsers = async (res: ServerResponse) => {
  const users = await usersService.getUsers();
  const json = JSON.stringify({ users });
  res.writeHead(HttpStatusCode.OK, BASE_HEADERS);
  res.end(json);
};

export const getUserById = async (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split(`${BASE_URL}/`).at(-1);
  const user = await usersService.getUserById(id);
  const json = JSON.stringify({ user });
  res.writeHead(HttpStatusCode.OK, BASE_HEADERS);
  res.end(json);
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const user = await parseBody(req);
    await usersService.createUser(user);
    res.writeHead(HttpStatusCode.CREATED);
    res.end();
  } catch (e) {
    onError(res, e as ApiError);
  }
};

export const updateUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const id = req.url?.split(`${BASE_URL}/`).at(-1);
    const user = await parseBody(req);
    const updatedUser = await usersService.updateUser(id, user);
    const json = JSON.stringify({ user: updatedUser });
    res.writeHead(HttpStatusCode.OK, BASE_HEADERS);
    res.end(json);
  } catch (e) {
    onError(res, e as ApiError);
  }
};

export const deleteUser = async (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split(`${BASE_URL}/`).at(-1);
  await usersService.deleteUser(id);
  res.writeHead(HttpStatusCode.NO_CONTENT);
  res.end();
};
