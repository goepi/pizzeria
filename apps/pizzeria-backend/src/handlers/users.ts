import { tokensHandler } from './tokens/index';
import { dataInterface } from '../data/index';
import { helpers } from '../utils/index';
import { StatusCode } from '../server/types';
import { User } from '../data/types';
import { CallbackError } from '../types/errors';
import { DataObject } from '../server/types';
import { verifyToken } from './tokens/helpers';

export interface UsersSubHandler {
  get: (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError | User) => void) => void;
  post: (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError) => void) => void;
  put: (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError) => void) => void;
  delete: (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError) => void) => void;
}

export const usersHandler = {} as UsersSubHandler;

/*
 * GET
 * Required data payload fields:
 */
usersHandler.get = (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError | User) => void) => {
  if (typeof data.queryStringObject.username === 'object') {
    callback(403, { error: 'Invalid username parameter.' });
  } else if (typeof data.queryStringObject.username === 'string') {
    const username = data.queryStringObject.username.length < 30 ? data.queryStringObject.username.trim() : false;
    if (username) {
      const token = typeof data.headers.token === 'string' ? data.headers.token : false;
      if (token) {
        verifyToken(token, username, isTokenValid => {
          if (isTokenValid) {
            dataInterface.read('users', username, (err, userData) => {
              if (err) {
                callback(500, { error: 'Error retrieving user.' });
              } else {
                callback(200, userData);
              }
            });
          } else {
            callback(403, { error: 'Invalid authentication token.' });
          }
        });
      } else {
        callback(403, { error: 'Invalid token.' });
      }
    } else {
      callback(403, { error: 'Username must be shorter than 30 characters.' });
    }
  } else {
    callback(400, { error: 'Missing query string parameter' });
  }
};

usersHandler.post = (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError) => void) => {
  const username =
    typeof data.payload.username === 'string' && data.payload.username.length < 30
      ? data.payload.username.trim()
      : false;
  const password =
    typeof data.payload.password === 'string' && data.payload.password.length > 0 ? data.payload.password : false;
  const email =
    typeof data.payload.email === 'string' && data.payload.email.length > 0 && helpers.validateEmail(data.payload.email)
      ? data.payload.email
      : false;
  const address =
    typeof data.payload.address === 'string' && data.payload.address.length > 0 ? data.payload.address : false;

  if (username && password && email && address) {
    dataInterface.read('users', username, err => {
      if (err) {
        const hashedPassword = helpers.hash(password);

        if (hashedPassword) {
          const newUser = {
            username,
            hashedPassword,
            email,
            address,
          };
          dataInterface.create('users', username, newUser, userCreateErr => {
            if (!userCreateErr) {
              callback(200);
            } else {
              callback(500, { error: `Error creating new user: ${err}` });
            }
          });
        } else {
          callback(500, { error: 'Error creating new user: could not hash password.' });
        }
      } else {
        callback(422, { error: 'Username already exists.' });
      }
    });
  } else {
    callback(403, { error: 'Missing or invalid required fields.' });
  }
};

usersHandler.put = (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError) => void) => {
  const username =
    typeof data.payload.username === 'string' && data.payload.username.length < 30
      ? data.payload.username.trim()
      : false;
  const password =
    typeof data.payload.password === 'string' && data.payload.password.length > 0 ? data.payload.password : false;
  const email =
    typeof data.payload.email === 'string' && data.payload.email.length > 0 && helpers.validateEmail(data.payload.email)
      ? data.payload.email
      : false;
  const address =
    typeof data.payload.address === 'string' && data.payload.address.length > 0 ? data.payload.address : false;
  console.log(data.headers.token);
  if (username) {
    if (email || password || address) {
      const token = typeof data.headers.token === 'string' ? data.headers.token : false;
      if (token) {
        verifyToken(token, username, isTokenValid => {
          if (isTokenValid) {
            dataInterface.read('users', username, (err, userData) => {
              if (userData) {
                const hashedPassword = password ? helpers.hash(password) : userData.hashedPassword;

                if (hashedPassword) {
                  const newUser = {
                    ...userData,
                    email: email || userData.email,
                    hashedPassword,
                    address: address || userData.address,
                  };

                  dataInterface.update('users', username, newUser, updateErr => {
                    if (!updateErr) {
                      callback(200);
                    } else {
                      callback(500, { error: 'Error updating user data.' });
                    }
                  });
                } else {
                  callback(500, { error: 'Error updating user password.' });
                }
              }
            });
          } else {
            callback(403, { error: 'Invalid token.' });
          }
        });
      } else {
        callback(403, { error: 'Invalid token' });
      }
    }
  } else {
    callback(403, { error: 'Missing required field: username' });
  }
};

usersHandler.delete = (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError) => void) => {
  const username =
    typeof data.payload.username === 'string' && data.payload.username.length < 30
      ? data.payload.username.trim()
      : false;

  if (username) {
    const token = typeof data.headers.token === 'string' ? data.headers.token : false;
    if (token) {
      verifyToken(token, username, isTokenValid => {
        if (isTokenValid) {
          dataInterface.read('users', username, err => {
            if (!err) {
              dataInterface.delete('users', username, deleteErr => {
                if (!deleteErr) {
                  callback(200);
                } else {
                  callback(500, { error: 'Error deleting user' });
                }
              });
            } else {
              callback(400, { error: 'Could not find specified user' });
            }
          });
        } else {
          callback(403, { error: 'Invalid token.' });
        }
      });
    } else {
      callback(403, { error: 'Invalid token.' });
    }
  }
};
