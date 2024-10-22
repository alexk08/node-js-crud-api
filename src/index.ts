import { createServer } from 'http';
import { config } from 'dotenv';
import { router } from './router';

config();

const server = createServer(router);

server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
