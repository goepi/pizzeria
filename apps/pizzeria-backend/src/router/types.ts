import { ParsedRequest, StatusCode } from '../server/types';
import { CallbackError } from '../types/errors';

export type HandlerCallback<T> = (
  statusCode: StatusCode,
  payload?: CallbackError | T,
  contentType?: ContentType
) => void;

export type Handler<T> = (data: ParsedRequest, callback: HandlerCallback<T>) => void;

export type ContentType = 'json' | 'html' | 'favicon' | 'plain' | 'css' | 'png' | 'jpg';

export const isValidContentType = (contentType: string): contentType is ContentType =>
  ['json', 'html', 'favicon', 'plain', 'css', 'png', 'jpg'].indexOf(contentType) !== -1;
