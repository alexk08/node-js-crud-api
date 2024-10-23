import cluster from 'node:cluster';
import { createServer, request } from 'node:http';
import { availableParallelism } from 'node:os';
import { onError } from '../errors/onError';
import { router } from '../router';
import { ApiError } from '../errors/apiError';

export const loadBalancer = () => {
  const numCPUs = availableParallelism();

  if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork({ PORT_COUNT: i });
    }

    cluster.on('exit', worker => {
      console.log(`worker ${worker.process.pid} died`);
    });

    let currentIndex = 0;
    const port = Number(process.env.PORT);

    const server = createServer((req, res) => {
      currentIndex = (currentIndex % numCPUs) + 1;
      const workerPort = port + currentIndex;
      const { method, url, headers } = req;
      if (!url) return;

      const workerRequest = request(
        new URL(url, `http://${headers.host}`),
        {
          port: workerPort,
          method,
          headers,
        },
        workerResponse => {
          if (!workerResponse.statusCode) return;
          res.writeHead(workerResponse.statusCode, workerResponse.headers);
          workerResponse.pipe(res);
        },
      );

      req.pipe(workerRequest);

      workerRequest.on('error', err => {
        onError(res, err as ApiError);
      });
    });

    server.listen(process.env.PORT, () => {
      console.log(`Primary server ${process.pid} listening on port ${port}`);
    });
  } else {
    const port = Number(process.env.PORT) + Number(process.env.PORT_COUNT) + 1;

    const server = createServer((req, res) => {
      router(req, res);
      console.log('Request from client to port:', req.socket.localPort);
    });

    server.listen(port, () => {
      console.log(`Worker server ${process.pid} listening on port ${port}`);
    });
  }
};
