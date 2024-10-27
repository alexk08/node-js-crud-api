import { loadBalancer } from './server/loadBalancer';
import { singleServer } from './server/singleServer';

const isMultiMode = process.argv[2] === '--multi';

export const server = isMultiMode ? loadBalancer : singleServer;

server();
