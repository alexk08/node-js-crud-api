import { createServer } from 'http';
import { config } from 'dotenv';
import { UsersService } from './services/usersService';
import { ApiError } from './errors/apiError';
import { onError } from './errors/onError';
import { HttpMethods } from './types';
import { BASE_URL } from './constants';
import { isValidPath } from './utils';

const usersService = new UsersService();

config();

const server = createServer((req, res) => {
  try {
    if (!req.url) throw new ApiError('page_not_found');

    if (req.method === HttpMethods.GET && req.url === BASE_URL) {
      const users = usersService.getUsers();
      const json = JSON.stringify({ users });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(json);
      return;
    }

    if (req.method === HttpMethods.GET && isValidPath(req.url)) {
      const id = req.url.split(`${BASE_URL}/`).at(-1);
      const user = usersService.getUserById(id);
      const json = JSON.stringify({ user });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(json);
      return;
    }

    if (req.method === HttpMethods.POST && req.url === BASE_URL) {
      let body = '';

      req
        .on('data', chunk => {
          body += chunk;
        })
        .on('end', () => {
          try {
            const user = JSON.parse(body);
            usersService.createUser(user);
            res.writeHead(201);
            res.end();
          } catch (e) {
            onError(res, e as ApiError);
          }
        })
        .on('error', () => {
          onError(res, new ApiError('other_error'));
        });

      return;
    }

    if (req.method === HttpMethods.PUT && isValidPath(req.url)) {
      let body = '';
      const id = req.url.split(`${BASE_URL}/`).at(-1);

      req
        .on('data', chunk => {
          body += chunk;
        })
        .on('end', () => {
          try {
            const upFields = JSON.parse(body);
            const user = usersService.updateUser(id, upFields);
            const json = JSON.stringify({ user });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(json);
          } catch (e) {
            onError(res, e as ApiError);
          }
        })
        .on('error', () => {
          onError(res, new ApiError('other_error'));
        });

      return;
    }

    if (req.method === HttpMethods.DELETE && isValidPath(req.url)) {
      const id = req.url.split(`${BASE_URL}/`).at(-1);
      usersService.deleteUser(id);
      res.writeHead(204);
      res.end();
      return;
    }

    throw new ApiError('page_not_found');
  } catch (e) {
    onError(res, e as ApiError);
  }
});

server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
