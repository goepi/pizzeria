import { IncomingHttpHeaders } from 'http2';
import { ParsedUrlQuery } from 'querystring';

export interface DataObject {
  queryStringObject: ParsedUrlQuery;
  method: string;
  headers: IncomingHttpHeaders;
  payload: any;
}

export type StatusCode = 200 | 400 | 403 | 404 | 422 | 500;
