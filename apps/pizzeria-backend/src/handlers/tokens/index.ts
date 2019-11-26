import { dataInterface } from '../../data/index';
import { helpers } from '../../utils/index';
import { DataObject, StatusCode } from '../../server/types';
import { CallbackError } from '../../types/errors';
import { Token } from '../../data/types';
import { validateExtend, validatePassword, validateTokenId, validateUsername } from '../requestValidation';

export interface TokensHandler {
  get: (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError | Token) => void) => void;
  post: (data: DataObject, callback: (statusCode: StatusCode, payload: CallbackError | Token) => void) => void;
  put: (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError) => void) => void;
  delete: (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError) => void) => void;
}

export const tokensHandler = {} as TokensHandler;

tokensHandler.get = (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError | Token) => void) => {
  const id = validateTokenId(data.payload.id);

  if (id) {
    dataInterface.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404);
      }
    });
  } else {
    callback(403, { error: 'Missing required field: username.' });
  }
};

tokensHandler.post = (data: DataObject, callback: (statusCode: StatusCode, payload: CallbackError | Token) => void) => {
  const username = validateUsername(data.payload.username);
  const password = validatePassword(data.payload.password);

  if (username && password) {
    dataInterface.read('users', username, (err, userData) => {
      if (!err && userData) {
        const hashedPassword = helpers.hash(password);
        if (hashedPassword) {
          if (hashedPassword === userData.hashedPassword) {
            const tokenId = helpers.createRandomString(20);

            const expires = Date.now() + 1000 * 60 * 60; // one hour
            const tokenObject = {
              id: tokenId,
              username,
              expires,
            };
            dataInterface.create('tokens', tokenId, tokenObject, err => {
              if (!err) {
                callback(200, tokenObject);
              } else {
                callback(500, { error: 'Error creating token.' });
              }
            });
          } else {
            callback(403, { error: 'Password did not match the stored user password' });
          }
        } else {
          callback(500, { error: 'Could not hash password.' });
        }
      } else {
        callback(400, { error: 'Could not find specified user' });
      }
    });
  } else {
    callback(403, { error: 'Missing required fields.' });
  }
};

tokensHandler.put = (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError) => void) => {
  const id = validateTokenId(data.payload.id);

  const extend = validateExtend(data.payload.extend);

  if (id && extend) {
    dataInterface.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData) {
        if (tokenData.expires > Date.now()) {
          tokenData.expires = Date.now() + 1000 * 60 * 60;
          dataInterface.update('tokens', id, tokenData, err => {
            if (!err) {
              callback(200);
            } else {
              callback(500, { error: 'Error extending token.' });
            }
          });
        }
      } else {
        callback(400, { error: 'Specified token does not exist' });
      }
    });
  } else {
    callback(400, { error: 'Missing or invalid required fields.' });
  }
};

tokensHandler.delete = (data: DataObject, callback: (statusCode: StatusCode, payload?: CallbackError) => void) => {
  const id = validateTokenId(data.payload.id);

  if (id) {
    dataInterface.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData) {
        dataInterface.delete('tokens', id, err => {
          if (!err) {
            callback(200);
          } else {
            callback(500, { error: 'Could not delete token.' });
          }
        });
      } else {
        callback(400, { error: 'Could not find specified token' });
      }
    });
  } else {
    callback(400, { error: 'Missing required field.' });
  }
};
