import { UrlWithParsedQuery } from 'url';
import { ParsedUrlQuery } from 'querystring';
import { IncomingHttpHeaders } from 'http';

export type StatusCode = 200 | 204 | 400 | 403 | 404 | 422 | 500;

export interface Cookies {
  [key: string]: string;
}

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

export type ParseRequestCallback = (parsedRequest: ParsedRequest) => void;

export interface StringInterpolationKeys {
  [key: string]: string;
}
