import fs from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import https, { ServerOptions } from 'https';
import path from 'path';
import { handleParsedRequest, ParsedRequest, parseRequest } from './helpers';

const httpsServerOptions: ServerOptions = {
  key: fs.readFileSync(path.resolve(__dirname, './../../https/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, './../../https/cert.pem')),
};

export const httpsServer = https.createServer(httpsServerOptions, (req: IncomingMessage, res: ServerResponse) => {
  parseRequest(req, (parsedRequest: ParsedRequest) => handleParsedRequest(parsedRequest, res));
});
