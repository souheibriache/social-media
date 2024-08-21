"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var socketVerifyAccessToken = function (socket, next) {
    try {
        var ACCESS_TOKEN_PRIVATE_KEY = process.env.ACCESS_TOKEN_PRIVATE_KEY;
        var token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Unauthorized'));
        }
        jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_PRIVATE_KEY, function (err, decoded) {
            if (err) {
                return next(new Error('Unauthorized'));
            }
            socket.data.user = decoded;
            next();
        });
    }
    catch (err) {
        console.error('Internal Server Error:', err);
        next(new Error('Internal Server Error'));
    }
};
exports.default = socketVerifyAccessToken;
