import { handlers } from '../handlers';
import { DataObject, StatusCode } from '../server/types';
import { CallbackError } from '../types/errors';

export const router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens,
  menus: handlers.menus,
};

type HandlerCallback = <T>(statusCode: StatusCode, payload?: CallbackError | T) => void;

type Handler = (data: DataObject, callback: HandlerCallback) => void;

interface Route {
  regex: RegExp;
  callback: Handler;
}

export class Router {
  private getRoutes: Route[] = [];
  private postRoutes: Route[] = [];
  private putRoutes: Route[] = [];
  private deleteRoutes: Route[] = [];

  public get = <T>(path: string, callback: Handler) => {
    const route = {
      regex: new RegExp(path),
      callback,
    };

    this.getRoutes = [...this.getRoutes, route];
  };

  public handleRequest = (data: DataObject, callback: HandlerCallback) => {
    switch (data.method) {
      case 'get': {
        this.handleGet(data, callback);
      }
    }
  };

  public handleGet(data: DataObject, callback: HandlerCallback) {
    this.getRoutes.forEach(r => {
      r.regex.exec(data.path);
    });
  }
}
