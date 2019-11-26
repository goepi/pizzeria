import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'http';
import { ParsedUrlQuery } from 'querystring';
import { StringDecoder } from 'string_decoder';
import { default as url, UrlWithParsedQuery } from 'url';
import { handlers } from '../handlers';
import { router } from '../router';
import { helpers } from '../utils/cryptography';
import { Cookies, DataObject, StatusCode } from './types';

export const parseCookies = (request: IncomingMessage) => {
  interface CookieData {
    [key: string]: string;
  }

  const data: CookieData = {};
  const cookie = request.headers.cookie;

  if (cookie) {
    cookie.split(';').forEach(keyValueStr => {
      const parts = keyValueStr.split('=');
      const key = parts.shift();
      if (key) {
        data[key.trim()] = decodeURI(parts.join('='));
      }
    });
  }

  return data;
};

export const addResponseCookies = (res: ServerResponse, cookies: Cookies) => {
  const strArray = [];

  for (const key in cookies) {
    if (cookies.hasOwnProperty(key)) {
      strArray.push(`${key}=${cookies[key]}`);
    }
  }

  const cookiesString = strArray.join(';');

  res.setHeader('Set-Cookie', cookiesString);
};

export type ValidTrimmedPath = keyof typeof router;

export type ParseRequestCallback = (parsedRequest: ParsedRequest) => void;

export const parseRequest = (req: IncomingMessage, callback: ParseRequestCallback) => {
  // Get the url and parse it
  const parsedUrl = req.url ? url.parse(req.url, true) : false;

  // Get the HTTP method
  const method = req.method ? req.method.toLowerCase() : false;

  if (parsedUrl && method) {
    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = (path && path.replace(/^\/+|\/+$/g, '')) || '';

    //
    if (isPathValid(trimmedPath)) {
      // Get the query string as an object
      const queryStringObject = parsedUrl.query;

      // Get the headers as an object
      const headers = req.headers;

      // Get the cookies as an object
      const cookies = parseCookies(req);

      // Get the payload, if any
      const decoder = new StringDecoder('utf-8');
      let buffer = '';
      req.on('data', data => {
        buffer += decoder.write(data);
      });

      req.on('end', () => {
        buffer += decoder.end();

        const payload = helpers.parseJsonToObject(buffer);

        callback({ parsedUrl, method, trimmedPath, queryStringObject, headers, payload, cookies });
      });
    }
  }

  return false;
};

const sendResponse = (res: ServerResponse) => (statusCode: StatusCode, payload?: any) => {
  // use  status code called back by handler or use default status code 200
  statusCode = typeof statusCode === 'number' ? statusCode : 200;
  // use payload called back by handler or use default: empty object
  payload = typeof payload === 'object' ? payload : {};

  // convert payload to string, to be sent back to user
  const payloadString = JSON.stringify(payload);

  // Send the response
  // writeHead writes status code to the response
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(payloadString);

  console.log('Response ', statusCode, payloadString);
};

export const handleParsedRequest = (
  { method, headers, trimmedPath, queryStringObject, payload, cookies }: ParsedRequest,
  res: ServerResponse
) => {
  // construct data object to send to the handler
  const data: DataObject = {
    queryStringObject,
    method,
    headers,
    payload,
    cookies,
  };

  // given the path in the url, choose which handler should handle this request
  const chosenHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handlers.notFound;

  // route the request to the handler
  chosenHandler(data, sendResponse(res));
};
export const isPathValid = (trimmedPath: string): trimmedPath is ValidTrimmedPath =>
  Object.keys(router).indexOf(trimmedPath) !== -1;

export interface ParsedRequest {
  parsedUrl: UrlWithParsedQuery;
  method: string;
  trimmedPath: ValidTrimmedPath;
  queryStringObject: ParsedUrlQuery;
  headers: IncomingHttpHeaders;
  payload: any;
  cookies: Cookies;
}
