import crypto, { HexBase64Latin1Encoding } from 'crypto';

interface Helpers {
  hash: (str: string) => string | false;
  parseJsonToObject: (str: string) => object;
  createRandomString: (strLength: number) => string | false;
  checksum: (str: string, algorithm: string, encoding: HexBase64Latin1Encoding) => string;
}

// Container for all the helpers
export const helpers = {
  // Create a SHA256 hash
  hash: (str: string) => {
    if (typeof str === 'string' && str.length) {
      return crypto
        .createHmac('sha256', ENV_HASHING_SECRET)
        .update(str)
        .digest('hex');
    } else {
      return false;
    }
  },
  // Parse a JSON string to an object in all cases without throwing
  parseJsonToObject: (str: string) => {
    try {
      const obj = JSON.parse(str);
      return obj;
    } catch (e) {
      return {};
    }
  },
  // Create a string of random alphanumeric characters of a given length
  createRandomString: (strLength: number) => {
    if (typeof strLength === 'number' && strLength > 0) {
      // Define all possible characters that could go into a string
      const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      // Start the string
      let str = '';
      for (let i = 1; i <= strLength; i++) {
        // Get a random character from possible characters string
        const rand = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        // Append character to final string
        str += rand;
      }

      // return final string
      return str;
    } else {
      return false;
    }
  },
  checksum: (str: string, algorithm: string, encoding: HexBase64Latin1Encoding) => {
    return crypto
      .createHash(algorithm || 'md5')
      .update(str, 'utf8')
      .digest(encoding || 'hex');
  },
};
