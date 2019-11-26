import { IncomingMessage, ServerResponse } from 'http';
import { Cookies } from './types';

export const parseCookies = (request: IncomingMessage) => {
  interface CookieData {
    [key: string]: string;
  }

  const data: CookieData = {},
    cookie = request.headers.cookie;

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
    strArray.push(`${key}=${cookies[key]}`);
  }

  const cookiesString = strArray.join(';');

  res.setHeader('Set-Cookie', cookiesString);
};
