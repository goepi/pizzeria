// module for storing and editing data saved to disk
import fs from 'fs';
import path from 'path';
import { CallbackError } from '../types/errors';
import { helpers } from '../utils/cryptography';
import { Menu, Token, User } from './types';

type createUserCallback = (err: CallbackError | false, data?: User) => void;
type createTokenCallback = (err: CallbackError | false, data?: Token) => void;
type readUserCallback = (err: CallbackError | false, data?: User) => void;
type readTokenCallback = (err: CallbackError | false, data?: Token) => void;
type readMenuCallback = (err: CallbackError | false, data?: Menu) => void;

interface DataInterface {
  baseDir: string;
  create(dir: 'users', file: string, data: User, callback: createUserCallback): void;
  create(dir: 'tokens', file: string, data: Token, callback: createTokenCallback): void;
  read(dir: 'users', file: string, callback: readUserCallback): void;
  read(dir: 'tokens', file: string, callback: readTokenCallback): void;
  read(dir: 'menus', file: string, callback: readMenuCallback): void;
  update(dir: 'users', file: string, data: User, callback: (err: CallbackError | false) => void): void;
  update(dir: 'tokens', file: string, data: Token, callback: (err: CallbackError | false) => void): void;
  delete(dir: 'users' | 'tokens', file: string, callback: (err: CallbackError | false) => void): void;
}

export const dataInterface = {} as DataInterface;

dataInterface.baseDir = path.join(__dirname, '../.data');

// Write data to a file
dataInterface.create = (
  dir: 'users' | 'tokens',
  file: string,
  data: User | Token,
  callback: createUserCallback | createTokenCallback
) => {
  const filePath = `${dataInterface.baseDir}/${dir}/${file}.json`;

  // Open the file for writing
  fs.open(filePath, 'wx', (openErr, fileDescriptor) => {
    if (!openErr && fileDescriptor) {
      // Convert data to string
      const stringData = JSON.stringify(data);

      // Write to file and close it
      fs.writeFile(fileDescriptor, stringData, writeErr => {
        if (!writeErr) {
          fs.close(fileDescriptor, closeErr => {
            if (!closeErr) {
              callback(false);
            } else {
              callback({ error: 'Error closing new file' });
            }
          });
        } else {
          callback({ error: 'Error writing to new file' });
        }
      });
    } else {
      callback({ error: 'Could not create new file: ' + openErr });
    }
  });
};

dataInterface.read = (
  dir: 'users' | 'tokens' | 'menus',
  file: string,
  callback: readUserCallback | readTokenCallback | readMenuCallback
) => {
  const filePath = `${dataInterface.baseDir}/${dir}/${file}.json`;
  console.log(filePath);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (!err && data) {
      const parsedData = helpers.parseJsonToObject(data);
      callback(false, parsedData);
    } else {
      callback({ error: `Error reading data: ${err}` });
    }
  });
};

dataInterface.update = (
  dir: 'users' | 'tokens',
  file: string,
  data: User | Token,
  callback: (err: CallbackError | false) => void
) => {
  const filePath = `${dataInterface.baseDir}/${dir}/${file}.json`;
  // open the file for writing
  fs.open(filePath, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Convert data to string
      const stringData = JSON.stringify(data);

      // truncate the file
      fs.ftruncate(fileDescriptor, ftruncErr => {
        if (!ftruncErr) {
          // write to the file and close it
          fs.writeFile(fileDescriptor, stringData, writeErr => {
            if (!writeErr) {
              fs.close(fileDescriptor, closeErr => {
                if (!closeErr) {
                  callback(false);
                } else {
                  callback({ error: 'Error closing existing file' });
                }
              });
            } else {
              callback({ error: 'Error writing to existing file' });
            }
          });
        } else {
          callback({ error: 'Error truncating file' });
        }
      });
    } else {
      callback({ error: 'Could not open file for updating, it may not exist yet.' });
    }
  });
};

dataInterface.delete = (dir, file, callback) => {
  const filePath = `${dataInterface.baseDir}/${dir}/${file}.json`;
  // unlink the file
  fs.unlink(filePath, err => {
    if (!err) {
      callback(false);
    } else {
      callback({ error: 'Error deleting file' });
    }
  });
};
