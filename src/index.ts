import http from 'node:http';
import { config } from 'dotenv';
import { UsersService } from './services/usersService.js';

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
    if (!req.url || !isValidPath(req.url)) throw new Error('Page not found');

    switch (req.method) {
      case HttpMethods.GET:
        if (req.url === BASE_URL) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          const users = await usersService.getUsers();
          const json = JSON.stringify({ users });
          res.end(json);
          break;
        }
        const id = req.url.substring(11);
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
    console.error(e);
  }
});

server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
