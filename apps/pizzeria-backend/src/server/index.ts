import chalk from 'chalk';
import Debug from 'debug';
import http, { IncomingMessage, ServerOptions, ServerResponse } from 'http';
import https from 'https';
import { Router } from '../router';
import { ParsedRequest, parseRequest } from './helpers';
import { StatusCode } from './types';

const debug = Debug('app');

export class App {
  public constructor(private router: Router, private credentials?: ServerOptions) {
    this.router = router;
    this.credentials = credentials;
  }

  private startHttpsServer = () => {
    if (this.credentials) {
      const httpsServer = https.createServer(this.credentials, (req: IncomingMessage, res: ServerResponse) => {
        parseRequest(req, (parsedRequest: ParsedRequest) => this.handleParsedRequest(parsedRequest, res));
      });

      httpsServer.listen(ENV_HTTPS_PORT, () => {
        debug(`${chalk.cyan('HTTPS')} server listening on port ${chalk.green(ENV_HTTPS_PORT)}`);
      });
    }
  };

  private startHttpServer = () => {
    const httpServer = http.createServer((req: IncomingMessage, res: ServerResponse) => {
      parseRequest(req, (parsedRequest: ParsedRequest) => this.handleParsedRequest(parsedRequest, res));
    });

    httpServer.listen(ENV_HTTP_PORT, () => {
      debug(`${chalk.cyan('HTTP')} server listening on port ${chalk.green(ENV_HTTP_PORT)}`);
    });
  };

  private handleParsedRequest = (parsedRequest: ParsedRequest, res: ServerResponse) => {
    this.router.handleRequest(parsedRequest, this.sendResponse(res));
  };

  private sendResponse = (res: ServerResponse) => (statusCode: StatusCode, payload?: any) => {
    // use  status code called back by handler or use default status code 200
    statusCode = typeof statusCode === 'number' ? statusCode : 200;
    // use payload called back by handler or use default: empty object
    payload = typeof payload === 'object' ? payload : {};

    // convert payload to string, to be sent back to user
    const payloadString = JSON.stringify(payload);

    // Send the response
    // writeHead writes status code to the response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.writeHead(200);
    res.end(payloadString);

    debug('Response ', statusCode, payloadString);
  };

  public listen = () => {
    if (this.credentials) {
      this.startHttpsServer();
    } else {
      this.startHttpServer();
    }
  };
}
