import chalk from 'chalk';
import Debug from 'debug';
import http, { IncomingMessage, ServerOptions, ServerResponse } from 'http';
import https from 'https';
import { Router } from '../router';
import { parseRequest } from './helpers';
import { ParsedRequest, StatusCode } from './types';
import { ContentType } from '../router/types';

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
    this.router.handleRequest(parsedRequest, res, this.sendResponse(res));
  };

  private sendResponse = (res: ServerResponse) => (
    statusCode: StatusCode,
    payload?: any,
    contentType?: ContentType
  ) => {
    contentType = contentType ? contentType : 'json';
    this.setContentType(contentType, res);

    const payloadString = this.getPayloadString(contentType, payload);

    // Send the response
    // writeHead writes status code to the response
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.writeHead(statusCode);

    res.end(payloadString);

    debug('Response ', statusCode, payloadString);
  };

  private setContentType = (contentType: ContentType, res: ServerResponse) => {
    res.setHeader('Content-Type', MapContentType[contentType]);
  };

  private getPayloadString = (contentType: ContentType, payload?: any) => {
    let payloadString = '';

    switch (contentType) {
      case 'json': {
        payloadString = JSON.stringify(typeof payload === 'object' ? payload : {});
        break;
      }
      case 'html': {
        payloadString = typeof payload === 'string' ? payload : '';
        break;
      }
      default: {
        payloadString = typeof payload !== 'undefined' ? payload : '';
      }
    }

    return payloadString;
  };

  public listen = () => {
    if (this.credentials) {
      this.startHttpsServer();
    } else {
      this.startHttpServer();
    }
  };
}

const MapContentType: { [contentType in ContentType]: string } = {
  json: 'application/json',
  html: 'text/html',
  favicon: 'image/x-icon',
  plain: 'text/plain',
  css: 'text/css',
  png: 'image/png',
  jpg: 'image/jpeg',
};
