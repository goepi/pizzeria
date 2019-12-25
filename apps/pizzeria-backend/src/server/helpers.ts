import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'http';
import { ParsedUrlQuery } from 'querystring';
import { StringDecoder } from 'string_decoder';
import { default as url, UrlWithParsedQuery } from 'url';
import { helpers } from '../utils/cryptography';
import { Cookies } from './types';

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

export type ParseRequestCallback = (parsedRequest: ParsedRequest) => void;

export const parseRequest = (req: IncomingMessage, callback: ParseRequestCallback) => {
  // Get the url and parse it
  const parsedUrl = req.url ? url.parse(req.url, true) : false;

  // Get the HTTP method
  const method = req.method ? req.method.toLowerCase() : false;

  if (parsedUrl && method) {
    // Get the path
    const path = parsedUrl.pathname || '/';

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

      callback({ parsedUrl, method, path, queryStringObject, headers, payload, cookies });
    });
  }

  return false;
};

export interface PathVariables {
  [pathVariable: string]: string;
}

export interface ParsedRequest {
  parsedUrl: UrlWithParsedQuery;
  method: string;
  path: string;
  queryStringObject: ParsedUrlQuery;
  headers: IncomingHttpHeaders;
  payload: any;
  cookies: Cookies;
  pathVariables?: PathVariables;
}
