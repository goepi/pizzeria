import { httpServer } from './server/httpServer';
import { httpsServer } from './server/httpsServer';

httpServer.listen(ENV_HTTP_PORT, () => {
  console.log('HTTP server listening on port ' + ENV_HTTP_PORT);
});

httpsServer.listen(ENV_HTTPS_PORT, () => {
  console.log('HTTPS server listening on port ' + ENV_HTTPS_PORT);
});
