// Verify if a given token id is currently valid for a given user
import { dataInterface } from '../../data';
import { Token } from '../../data/types';

export const verifyToken = (id: string, username: string, callback: (error: boolean) => void) => {
  // Lookup the token
  dataInterface.read('tokens', id, (err, tokenData?: Token) => {
    if (!err && tokenData) {
      // Check that the token is for the given user and has not expired
      if (tokenData.username === username && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};
