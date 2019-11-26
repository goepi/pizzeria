import { Menu, Token, User } from '../data/types';
import { isValidMethodForHandler } from '../router/helpers';
import { DataObject, StatusCode } from '../server/types';
import { CallbackError } from '../types/errors';
import { MenusHandler, menusHandler } from './menus';
import { tokensHandler, TokensHandler } from './tokens/index';
import { usersHandler, UsersSubHandler } from './users/index';

interface Handlers {
  users: (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError | User) => void) => void;
  tokens: (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError | Token) => void) => void;
  menus: (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError | Menu) => void) => void;
  notFound: (data: DataObject, callback: (statusCode: 404, payload: CallbackError) => void) => void;
  ping: (data: DataObject, callback: (statusCode: 200) => void) => void;
}

interface SubHandlers {
  users: UsersSubHandler;
  tokens: TokensHandler;
  menus: MenusHandler;
}

// first handler where keys are paths
export const handlers: Handlers = {
  users: (data: DataObject, callback) => {
    if (isValidMethodForHandler(usersHandler)(data.method)) {
      subHandlers.users[data.method](data, callback);
    }
  },

  tokens: (data: DataObject, callback) => {
    if (isValidMethodForHandler(tokensHandler)(data.method)) {
      subHandlers.tokens[data.method](data, callback);
    }
  },
  menus: (data: DataObject, callback) => {
    if (isValidMethodForHandler(menusHandler)(data.method)) {
      subHandlers.menus[data.method](data, callback);
    }
  },
  notFound: (data: DataObject, callback) => {
    callback(404, { error: 'That route does not exist.' });
  },
  ping: (data: DataObject, callback) => {
    callback(200);
  },
};

// second handler where keys are HTTP methods
const subHandlers: SubHandlers = {
  users: usersHandler,
  tokens: tokensHandler,
  menus: menusHandler,
};
