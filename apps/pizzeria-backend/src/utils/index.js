"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
// Container for all the helpers
exports.helpers = {};
// Create a SHA256 hash
exports.helpers.hash = function (str) {
    if (typeof str === 'string' && str.length) {
        return crypto_1.default
            .createHmac('sha256', ENV_HASHING_SECRET)
            .update(str)
            .digest('hex');
    }
    else {
        return false;
    }
};
// Parse a JSON string to an object in all cases without throwing
exports.helpers.parseJsonToObject = function (str) {
    try {
        var obj = JSON.parse(str);
        return obj;
    }
    catch (e) {
        return {};
    }
};
// Create a string of random alphanumeric characters of a given length
exports.helpers.createRandomString = function (strLength) {
    if (typeof strLength === 'number' && strLength > 0) {
        // Define all possible characters that could go into a string
        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        // Start the string
        var str = '';
        for (var i = 1; i <= strLength; i++) {
            // Get a random character from possible characters string
            var rand = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append character to final string
            str += rand;
        }
        // return final string
        return str;
    }
    else {
        return false;
    }
};
exports.helpers.checksum = function (str, algorithm, encoding) {
    return crypto_1.default
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex');
};
exports.helpers.validateEmail = function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
