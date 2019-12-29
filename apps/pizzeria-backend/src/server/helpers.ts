import { IncomingMessage, ServerResponse } from 'http';
import { StringDecoder } from 'string_decoder';
import { default as url } from 'url';
import { helpers } from '../utils/cryptography';
import { Cookies, ParseRequestCallback, StringInterpolationKeys } from './types';
import path from 'path';
import fs from 'fs';
import { config, TemplateStrings } from '../config';

export const parseCookies = (request: IncomingMessage) => {
  interface CookieData {
    [key: string]: string;
  }

  const data: CookieData = {};
  const cookie = request.headers.cookie;

  if (cookie) {
    cookie.split(';').forEach(keyValueStr => {
      const parts = keyValueStr.split('=');
      const key = parts.shift();
      if (key) {
        data[key.trim()] = decodeURI(parts.join('='));
      }
    });
  }

  return data;
};

export const addResponseCookies = (res: ServerResponse, cookies: Cookies) => {
  const strArray = [];

  for (const key in cookies) {
    if (cookies.hasOwnProperty(key)) {
      strArray.push(`${key}=${cookies[key]}`);
    }
  }

  const cookiesString = strArray.join(';');

  res.setHeader('Set-Cookie', cookiesString);
};

export const parseRequest = (req: IncomingMessage, callback: ParseRequestCallback) => {
  // Get the url and parse it
  const parsedUrl = req.url ? url.parse(req.url, true) : false;

  // Get the HTTP method
  const method = req.method ? req.method.toLowerCase() : false;

  if (parsedUrl && method) {
    // Get the path
    const urlPath = parsedUrl.pathname || '/';

    // Get the query string as an object
    const queryStringObject = parsedUrl.query;

    // Get the headers as an object
    const headers = req.headers;

    // Get the cookies as an object
    const cookies = parseCookies(req);

    // Get the payload, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', data => {
      buffer += decoder.write(data);
    });

    req.on('end', () => {
      buffer += decoder.end();

      const payload = helpers.parseJsonToObject(buffer);

      callback({ parsedUrl, method, path: urlPath, queryStringObject, headers, payload, cookies });
    });
  }

  return false;
};

// Get the string content of a template, and use provided data for string interpolation
export const getTemplate = (templateName: string, data: StringInterpolationKeys, callback) => {
  if (templateName.length > 0 && data) {
    const templatesDir = path.join(__dirname, '../templates/');
    fs.readFile(`${templatesDir}${templateName}.html`, 'utf8', (err, str) => {
      if (!err && str && str.length > 0) {
        // Do interpolation on the string
        const finalString = interpolate(str, data);
        callback(false, finalString);
      } else {
        callback(true);
      }
    });
  } else {
    callback(true);
  }
};

// Add the universal header and footer to a string, and pass provided data object to header and footer for interpolation
export const addUniversalTemplates = (str, data, callback) => {
  str = typeof str == 'string' && str.length > 0 ? str : '';
  data = typeof data == 'object' && data !== null ? data : {};
  // Get the header
  helpers.getTemplate('_header', data, function(err, headerString) {
    if (!err && headerString) {
      // Get the footer
      helpers.getTemplate('_footer', data, function(err, footerString) {
        if (!err && headerString) {
          // Add them all together
          var fullString = headerString + str + footerString;
          callback(false, fullString);
        } else {
          callback('Could not find the footer template');
        }
      });
    } else {
      callback('Could not find the header template');
    }
  });
};

// interpolate strings into template
export const interpolate = (templateStr: string, data: TemplateStrings) => {
  const interpolations = {...data};

  // Add the templateGlobals to the data object, prepending their key name with "global."
  for (const key in config.templateStrings) {
    if (config.templateStrings.hasOwnProperty(key)) {
      interpolations[`global.${key}`] = config.templateStrings[key];
    }
  }

  // for each key in interpolations, insert the value into the corresponding placeholder in the template
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const replace = data[key];
      const find = `{${key}}`;
      templateStr = templateStr.replace(find, replace);
    }
  }
  return templateStr;
};

// Get the contents of a static (public) asset
const getStaticAsset = (fileName: string, callback: (err: boolean, data: Buffer)) => {
  if (fileName.length > 0) {
    const publicDir = path.join(__dirname, '../public/');
    fs.readFile(`${publicDir}${fileName}`, (err, data) => {
      if (!err && data) {
        callback(false, data);
      } else {
        callback(true);
      }
    });
  } else {
    callback(true);
  }
};
