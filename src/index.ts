import http from 'node:http';
import { config } from 'dotenv';
import { UsersService } from './services/usersService.js';
import { ApiError } from './errors/apiError.js';

const usersService = new UsersService();

const BASE_URL = '/api/users';

const isValidPath = (path: string) => {
  const regex = /^\/api\/users(\/[^\/]*)?$/;
  return regex.test(path);
};

enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

config();

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url || !isValidPath(req.url)) throw new ApiError('page_not_found');

    switch (req.method) {
      case HttpMethods.GET:
        res.writeHead(200, { 'Content-Type': 'application/json' });
        if (req.url === BASE_URL) {
          const users = await usersService.getUsers();
          const json = JSON.stringify({ users });
          res.end(json);
          break;
        }
        const id = req.url.split(BASE_URL).at(-1);
        const user = await usersService.getUserById(id);
        const json = JSON.stringify({ user });
        res.end(json);
        break;

      case HttpMethods.POST:
        break;
      case HttpMethods.PUT:
        break;
      case HttpMethods.DELETE:
        break;
      default:
    }
  } catch (e) {
    const { message, statusCode } = e as ApiError;
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: { message } }));
  }
});

server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
