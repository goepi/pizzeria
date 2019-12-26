import { dataInterface } from '../../data';
import { ParsedRequest } from '../../server/helpers';
import { StatusCode } from '../../server/types';
import { CallbackError } from '../../types/errors';
import { validateCart, validateTokenId, validateUsername } from '../../utils/requestValidation';
import { verifyToken } from '../tokens/helpers';

export interface Cart {
  [id: string]: number;
}

export interface CartsHandler {
  get: (data: ParsedRequest, callback: (statusCode: StatusCode, payload?: CallbackError | Cart) => void) => void;
  put: (data: ParsedRequest, callback: (statusCode: StatusCode, payload?: CallbackError | Cart) => void) => void;
  delete: (data: ParsedRequest, callback: (statusCode: StatusCode, payload?: CallbackError | Cart) => void) => void;
}

export const cartsHandler: CartsHandler = {
  get: (data: ParsedRequest, callback: (statusCode: StatusCode, payload?: CallbackError | Cart) => void) => {
    const id = validateTokenId(data.headers.token);
    const username = validateUsername(data.pathVariables && data.pathVariables.username);

    if (id && username) {
      verifyToken(id, username, isTokenValid => {
        if (isTokenValid) {
          dataInterface.read('users', username, (userErr, userData) => {
            if (!userErr && userData) {
              callback(200, userData.cart);
            } else {
              callback(400, { error: 'No user for this token' });
            }
          });
        } else {
          callback(403, { error: 'Invalid token.' });
        }
      });
    } else {
      callback(403, { error: 'Invalid request parameters.' });
    }
  },

  put: (data: ParsedRequest, callback: (statusCode: StatusCode, payload?: CallbackError | Cart) => void) => {
    const getNewCart = (oldCart: Cart, cart: Cart) => {
      const newCart = { ...oldCart };
      Object.keys(cart).forEach(k => {
        newCart[k] = cart[k] + (newCart[k] || 0);
      });
      return newCart;
    };
    validateAndModifyCart(data, getNewCart, callback);
  },
  delete: (data: ParsedRequest, callback: (statusCode: StatusCode, payload?: CallbackError | Cart) => void) => {
    const getNewCart = (oldCart: Cart, cart: Cart) => {
      const newCart = { ...oldCart };
      Object.keys(cart).forEach(k => {
        newCart[k] = Math.max(newCart[k] - cart[k], 0);
        if (newCart[k] === 0) {
          delete newCart[k];
        }
      });
      return newCart;
    };
    validateAndModifyCart(data, getNewCart, callback);
  },
};

const validateAndModifyCart = (
  data: ParsedRequest,
  getNewCart: (oldCart: Cart, cart: Cart) => Cart,
  callback: (statusCode: StatusCode, payload?: CallbackError | Cart) => void
) => {
  const id = validateTokenId(data.headers.token);
  const username = validateUsername(data.pathVariables && data.pathVariables.username);

  if (id && username) {
    validateCart(data.payload.cart, (isCartValid: boolean) => {
      if (isCartValid) {
        verifyToken(id, username, isTokenValid => {
          if (isTokenValid) {
            dataInterface.read('users', username, (userErr, userData) => {
              if (!userErr && userData) {
                const newCart = getNewCart(userData.cart, data.payload.cart);
                dataInterface.update('users', username, { ...userData, cart: newCart }, updateErr => {
                  callback(200, newCart);
                });
              } else {
                callback(400, { error: 'No user for this token' });
              }
            });
          } else {
            callback(403, { error: 'Invalid token' });
          }
        });
      } else {
        callback(403, { error: 'Invalid cart.' });
      }
    });
  } else {
    callback(403, { error: 'Invalid token.' });
  }
};
