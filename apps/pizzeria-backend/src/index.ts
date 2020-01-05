import fs from 'fs';
import { ServerOptions } from 'https';
import path from 'path';
import { cartsHandler } from './handlers/carts';
import { menusHandler } from './handlers/menus';
import { ordersHandler } from './handlers/orders';
import { tokensHandler } from './handlers/tokens';
import { usersHandler } from './handlers/users';
import { Router } from './router';
import { App } from './server';
import { indexHandler } from './handlers/index';
import { publicHandler } from './handlers/public';

const httpsServerOptions: ServerOptions = {
  key: fs.readFileSync(path.resolve(__dirname, '../https/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../https/cert.pem')),
};

// define routes
const router = new Router();

// Templates API
router.get('/', indexHandler.get);

// static assets API
router.get('/public/:filename', publicHandler.get);

// JSON API
router.get('/tokens', tokensHandler.get);
router.post('/tokens', tokensHandler.post);
router.put('/tokens', tokensHandler.put);
router.delete('/tokens', tokensHandler.delete);

router.get('/users', usersHandler.get);
router.post('/users', usersHandler.post);
router.put('/users', usersHandler.put);
router.delete('/users', usersHandler.delete);

router.get('/menus', menusHandler.get);

router.get('/users/:username/cart', cartsHandler.get);
router.put('/users/:username/cart', cartsHandler.put);
router.delete('/users/:username/cart', cartsHandler.delete);

router.get('/users/:username/orders', ordersHandler.get);
router.post('/users/:username/checkout', ordersHandler.post);

// initialize apps
const httpsApp = new App(router, httpsServerOptions);
const httpApp = new App(router);

// start servers
httpsApp.listen();
httpApp.listen();

// nodemon
process.once('SIGUSR2', () => {
  process.kill(process.pid, 'SIGUSR2');
});
