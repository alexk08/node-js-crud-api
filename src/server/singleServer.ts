import { createServer } from 'http';
import { router } from '../router';
import { config } from 'dotenv';

config();

export const singleServer = () => {
  const server = createServer(router);

  server.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
  });

  return server;
};
