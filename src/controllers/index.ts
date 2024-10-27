import { IncomingMessage, ServerResponse } from 'http';
import { UsersService } from '../services/usersService';
import { HttpStatusCode } from '../types';
import { BASE_HEADERS, BASE_URL } from '../constants';
import { parseBody } from '../utils';

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
  const json = JSON.stringify(user);
  res.writeHead(HttpStatusCode.OK, BASE_HEADERS);
  res.end(json);
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  const user = await parseBody(req);
  const createdUser = await usersService.createUser(user);
  const json = JSON.stringify(createdUser);
  res.writeHead(HttpStatusCode.CREATED, BASE_HEADERS);
  res.end(json);
};

export const updateUser = async (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split(`${BASE_URL}/`).at(-1);
  const user = await parseBody(req);
  const updatedUser = await usersService.updateUser(id, user);
  const json = JSON.stringify(updatedUser);
  res.writeHead(HttpStatusCode.OK, BASE_HEADERS);
  res.end(json);
};

export const deleteUser = async (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split(`${BASE_URL}/`).at(-1);
  await usersService.deleteUser(id);
  res.writeHead(HttpStatusCode.NO_CONTENT);
  res.end();
};

export const flushDB = async () => {
  await usersService.flushDB();
};
