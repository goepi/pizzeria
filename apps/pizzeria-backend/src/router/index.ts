import util from 'util';
import { ServerResponse } from 'http';
import { ParsedRequest } from '../server/types';
import { Handler, HandlerCallback } from './types';

const debug = util.debuglog('app:router');

interface Route {
  regex: RegExp;
  callback: Handler;
}

interface Routes {
  get: Route[];
  post: Route[];
  put: Route[];
  delete: Route[];
}

type RouteMethod = keyof Routes;

const isMethodValid = (method: string): method is RouteMethod =>
  ['get', 'post', 'put', 'delete'].indexOf(method) !== -1;

export class Router {
  private routes: Routes = {
    get: [],
    post: [],
    put: [],
    delete: [],
  };

  private getRegexFromPath = (path: string) => {
    // remove leading and trailing slashes
    const trimmedPath = (path && path.replace(/^\/+|\/+$/g, '')) || '';

    const parts = trimmedPath.split('/');

    let regex = '^';

    parts.forEach(p => {
      if (p.charAt(0) === ':') {
        regex = `${regex}/(?<${p.substr(1)}>.+)`;
      } else {
        regex = `${regex}/${p}`;
      }
    });
    regex = `${regex}$`;

    return regex;
  };

  public get = (path: string, callback: Handler) => {
    this.addRoute('get', path, callback);
  };

  public post = (path: string, callback: Handler) => {
    this.addRoute('post', path, callback);
  };

  public put = (path: string, callback: Handler) => {
    this.addRoute('put', path, callback);
  };

  public delete = (path: string, callback: Handler) => {
    this.addRoute('delete', path, callback);
  };

  public addRoute = (method: RouteMethod, path: string, callback: Handler) => {
    const regex = this.getRegexFromPath(path);

    const route = {
      regex: new RegExp(regex),
      callback,
    };

    this.routes[method] = [...this.routes[method], route];
  };

  public handlePreflight = (data: ParsedRequest, res: ServerResponse, callback: HandlerCallback) => {
    res.setHeader('Access-Control-Allow-Methods', 'PUT');
    res.setHeader('Access-Control-Allow-Headers', 'token');
    callback(204);
  };

  public handleRequest = (data: ParsedRequest, res: ServerResponse, callback: HandlerCallback) => {
    if (data.method === 'options') {
      return this.handlePreflight(data, res, callback);
    }
    if (isMethodValid(data.method)) {
      this.checkRoutes(this.routes[data.method], data, callback);
    } else {
      callback(403, { error: 'Invalid HTTP method' });
    }
  };

  public checkRoutes = (routes: Route[], data: ParsedRequest, callback: HandlerCallback) => {
    routes.some(r => {
      const result = r.regex.exec(data.path);
      debug(r.regex.toString(), data.path, result);
      if (result) {
        r.callback({ ...data, pathVariables: result.groups }, callback);
        return true;
      }
    });
  };
}
