import chalk from 'chalk';
import Debug from 'debug';
import { httpServer } from './server/httpServer';
import { httpsServer } from './server/httpsServer';

const debug = Debug('app');

httpServer.listen(ENV_HTTP_PORT, () => {
  debug(`${chalk.cyan('HTTP')} server listening on port ${chalk.green(ENV_HTTP_PORT)}`);
});

httpsServer.listen(ENV_HTTPS_PORT, () => {
  debug(`${chalk.cyan('HTTPS')} server listening on port ${chalk.green(ENV_HTTPS_PORT)}`);
});
