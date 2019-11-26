"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../data/index");
var index_2 = require("../utils/index");
var helpers_1 = require("./tokens/helpers");
exports.usersHandler = {};
/*
 * GET
 * Required data payload fields:
 */
exports.usersHandler.get = function (data, callback) {
    if (typeof data.queryStringObject.username === 'object') {
        callback(403, { error: 'Invalid username parameter.' });
    }
    else if (typeof data.queryStringObject.username === 'string') {
        var username_1 = data.queryStringObject.username.length < 30 ? data.queryStringObject.username.trim() : false;
        if (username_1) {
            var token = typeof data.headers.token === 'string' ? data.headers.token : false;
            if (token) {
                helpers_1.verifyToken(token, username_1, function (isTokenValid) {
                    if (isTokenValid) {
                        index_1.dataInterface.read('users', username_1, function (err, userData) {
                            if (err) {
                                callback(500, { error: 'Error retrieving user.' });
                            }
                            else {
                                callback(200, userData);
                            }
                        });
                    }
                    else {
                        callback(403, { error: 'Invalid authentication token.' });
                    }
                });
            }
            else {
                callback(403, { error: 'Invalid token.' });
            }
        }
        else {
            callback(403, { error: 'Username must be shorter than 30 characters.' });
        }
    }
    else {
        callback(400, { error: 'Missing query string parameter' });
    }
};
exports.usersHandler.post = function (data, callback) {
    var username = typeof data.payload.username === 'string' && data.payload.username.length < 30
        ? data.payload.username.trim()
        : false;
    var password = typeof data.payload.password === 'string' && data.payload.password.length > 0 ? data.payload.password : false;
    var email = typeof data.payload.email === 'string' && data.payload.email.length > 0 && index_2.helpers.validateEmail(data.payload.email)
        ? data.payload.email
        : false;
    var address = typeof data.payload.address === 'string' && data.payload.address.length > 0 ? data.payload.address : false;
    if (username && password && email && address) {
        index_1.dataInterface.read('users', username, function (err) {
            if (err) {
                var hashedPassword = index_2.helpers.hash(password);
                if (hashedPassword) {
                    var newUser = {
                        username: username,
                        hashedPassword: hashedPassword,
                        email: email,
                        address: address,
                    };
                    index_1.dataInterface.create('users', username, newUser, function (userCreateErr) {
                        if (!userCreateErr) {
                            callback(200);
                        }
                        else {
                            callback(500, { error: "Error creating new user: " + err });
                        }
                    });
                }
                else {
                    callback(500, { error: 'Error creating new user: could not hash password.' });
                }
            }
            else {
                callback(422, { error: 'Username already exists.' });
            }
        });
    }
    else {
        callback(403, { error: 'Missing or invalid required fields.' });
    }
};
exports.usersHandler.put = function (data, callback) {
    var username = typeof data.payload.username === 'string' && data.payload.username.length < 30
        ? data.payload.username.trim()
        : false;
    var password = typeof data.payload.password === 'string' && data.payload.password.length > 0 ? data.payload.password : false;
    var email = typeof data.payload.email === 'string' && data.payload.email.length > 0 && index_2.helpers.validateEmail(data.payload.email)
        ? data.payload.email
        : false;
    var address = typeof data.payload.address === 'string' && data.payload.address.length > 0 ? data.payload.address : false;
    console.log(data.headers.token);
    if (username) {
        if (email || password || address) {
            var token = typeof data.headers.token === 'string' ? data.headers.token : false;
            if (token) {
                helpers_1.verifyToken(token, username, function (isTokenValid) {
                    if (isTokenValid) {
                        index_1.dataInterface.read('users', username, function (err, userData) {
                            if (userData) {
                                var hashedPassword = password ? index_2.helpers.hash(password) : userData.hashedPassword;
                                if (hashedPassword) {
                                    var newUser = __assign(__assign({}, userData), { email: email || userData.email, hashedPassword: hashedPassword, address: address || userData.address });
                                    index_1.dataInterface.update('users', username, newUser, function (updateErr) {
                                        if (!updateErr) {
                                            callback(200);
                                        }
                                        else {
                                            callback(500, { error: 'Error updating user data.' });
                                        }
                                    });
                                }
                                else {
                                    callback(500, { error: 'Error updating user password.' });
                                }
                            }
                        });
                    }
                    else {
                        callback(403, { error: 'Invalid token.' });
                    }
                });
            }
            else {
                callback(403, { error: 'Invalid token' });
            }
        }
    }
    else {
        callback(403, { error: 'Missing required field: username' });
    }
};
exports.usersHandler.delete = function (data, callback) {
    var username = typeof data.payload.username === 'string' && data.payload.username.length < 30
        ? data.payload.username.trim()
        : false;
    if (username) {
        var token = typeof data.headers.token === 'string' ? data.headers.token : false;
        if (token) {
            helpers_1.verifyToken(token, username, function (isTokenValid) {
                if (isTokenValid) {
                    index_1.dataInterface.read('users', username, function (err) {
                        if (!err) {
                            index_1.dataInterface.delete('users', username, function (deleteErr) {
                                if (!deleteErr) {
                                    callback(200);
                                }
                                else {
                                    callback(500, { error: 'Error deleting user' });
                                }
                            });
                        }
                        else {
                            callback(400, { error: 'Could not find specified user' });
                        }
                    });
                }
                else {
                    callback(403, { error: 'Invalid token.' });
                }
            });
        }
        else {
            callback(403, { error: 'Invalid token.' });
        }
    }
};
