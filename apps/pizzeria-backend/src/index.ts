import fs from 'fs';
import { ServerOptions } from 'https';
import path from 'path';
import { Router } from './router';
import { App } from './server';
import { tokensHandler } from './handlers/tokens';

const httpsServerOptions: ServerOptions = {
  key: fs.readFileSync(path.resolve(__dirname, '../https/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../https/cert.pem')),
};

// define routes
const router = new Router();
router.get('/tokens', tokensHandler.get);
router.post('/tokens', tokensHandler.post);

// initialize apps
const httpsApp = new App(router, httpsServerOptions);
// const httpApp = new App(router);

// start servers
httpsApp.listen();
// httpApp.listen();

process.once('SIGUSR2', () => {
  process.kill(process.pid, 'SIGUSR2');
});
