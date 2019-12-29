import { dataInterface } from '../../data/index';
import { Token } from '../../data/types';
import { ParsedRequest, StatusCode } from '../../server/types';
import { CallbackError } from '../../types/errors';
import { helpers } from '../../utils/cryptography';
import { validateExtend, validatePassword, validateTokenId, validateUsername } from '../../utils/requestValidation';

export interface TokensHandler {
  get: (data: ParsedRequest, callback: (statusCode: StatusCode, payload?: CallbackError | Token) => void) => void;
  post: (data: ParsedRequest, callback: (statusCode: StatusCode, payload: CallbackError | Token) => void) => void;
  put: (data: ParsedRequest, callback: (statusCode: StatusCode, payload?: CallbackError) => void) => void;
  delete: (data: ParsedRequest, callback: (statusCode: StatusCode, payload?: CallbackError) => void) => void;
}

export const tokensHandler = {} as TokensHandler;

tokensHandler.get = (
  data: ParsedRequest,
  callback: (statusCode: StatusCode, payload?: CallbackError | Token) => void
) => {
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

tokensHandler.post = (
  data: ParsedRequest,
  callback: (statusCode: StatusCode, payload: CallbackError | Token) => void
) => {
  const username = validateUsername(data.payload.username);
  const password = validatePassword(data.payload.password);

  if (username && password) {
    dataInterface.read('users', username, (err, userData) => {
      if (!err && userData) {
        const hashedPassword = helpers.hash(password);
        if (hashedPassword) {
          if (hashedPassword === userData.hashedPassword) {
            const tokenId = helpers.createRandomString(20);

            if (tokenId) {
              const expires = Date.now() + 1000 * 60 * 60; // one hour
              const tokenObject = {
                id: tokenId,
                username,
                expires,
              };
              dataInterface.create('tokens', tokenId, tokenObject, tokenCreateErr => {
                if (!tokenCreateErr) {
                  callback(200, tokenObject);
                } else {
                  callback(500, { error: 'Error creating token.' });
                }
              });
            } else {
              callback(500, { error: 'Internal server error.' });
            }
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

tokensHandler.put = (data: ParsedRequest, callback: (statusCode: StatusCode, payload?: CallbackError) => void) => {
  const id = validateTokenId(data.payload.id);

  const extend = validateExtend(data.payload.extend);

  if (id && extend) {
    dataInterface.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData) {
        if (tokenData.expires > Date.now()) {
          tokenData.expires = Date.now() + 1000 * 60 * 60;
          dataInterface.update('tokens', id, tokenData, tokenUpdateErr => {
            if (!tokenUpdateErr) {
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

tokensHandler.delete = (data: ParsedRequest, callback: (statusCode: StatusCode, payload?: CallbackError) => void) => {
  const id = validateTokenId(data.payload.id);

  if (id) {
    dataInterface.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData) {
        dataInterface.delete('tokens', id, tokenDeleteErr => {
          if (!tokenDeleteErr) {
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
