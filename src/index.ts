import http from 'node:http';

import { logger } from './services/log.js';

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(process.env.PORT);
const smth: string = 'smth';

console.log(smth);
logger('anyth');
