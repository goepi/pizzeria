import { ParsedRequest, StatusCode } from '../server/types';
import { CallbackError } from '../types/errors';

export type HandlerCallback = <T>(statusCode: StatusCode, payload?: CallbackError | T) => void;

export type Handler = (data: ParsedRequest, callback: HandlerCallback) => void;
