import http, { IncomingMessage, ServerResponse } from 'http';
import { handleParsedRequest, ParsedRequest, parseRequest } from './helpers';

export const httpServer = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  parseRequest(req, (parsedRequest: ParsedRequest) => handleParsedRequest(parsedRequest, res));
});
