import crypto, { HexBase64Latin1Encoding } from 'crypto';

// Container for all the helpers
export const helpers = {} as any;

// Create a SHA256 hash
helpers.hash = function(str: string) {
  if (typeof str === 'string' && str.length) {
    return crypto
      .createHmac('sha256', ENV_HASHING_SECRET)
      .update(str)
      .digest('hex');
  } else {
    return false;
  }
};

// Parse a JSON string to an object in all cases without throwing
helpers.parseJsonToObject = function(str: string) {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

// Create a string of random alphanumeric characters of a given length
helpers.createRandomString = function(strLength: number) {
  if (typeof strLength === 'number' && strLength > 0) {
    // Define all possible characters that could go into a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    // Start the string
    var str = '';
    for (let i = 1; i <= strLength; i++) {
      // Get a random character from possible characters string
      var rand = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      // Append character to final string
      str += rand;
    }

    // return final string
    return str;
  } else {
    return false;
  }
};

helpers.checksum = function(str: string, algorithm: string, encoding: HexBase64Latin1Encoding) {
  return crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex');
};

helpers.validateEmail = function validateEmail(email: string) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
