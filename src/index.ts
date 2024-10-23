import { config } from 'dotenv';
import { loadBalancer } from './server/loadBalancer';
import { singleServer } from './server/singleServer';

config();

const isMultiMode = process.argv[2] === '--multi';

if (isMultiMode) {
  loadBalancer();
} else {
  singleServer();
}
