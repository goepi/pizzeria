import { usersHandler, UsersSubHandler } from './users';
import { tokensHandler, TokensHandler } from './tokens/index';
import { DataObject, StatusCode } from '../server/types';
import { CallbackError } from '../types/errors';
import { Token, User } from '../data/types';
import { isValidMethodForHandler } from '../router/helpers';

interface Handlers {
  users: (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError | User) => void) => void;
  tokens: (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError | Token) => void) => void;
  notFound: (data: DataObject, callback: (statusCode: 404, payload: CallbackError) => void) => void;
  ping: (data: DataObject, callback: (statusCode: 200) => void) => void;
}

interface SubHandlers {
  users: UsersSubHandler;
  tokens: TokensHandler;
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
};
