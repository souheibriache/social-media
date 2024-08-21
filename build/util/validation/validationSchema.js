"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileValidation = exports.createProfileValidation = exports.refreshTokenBodyValidation = exports.logInBodyValidation = exports.signUpBodyValidation = void 0;
var joi_1 = __importDefault(require("joi"));
var joi_password_complexity_1 = __importDefault(require("joi-password-complexity"));
var signUpBodyValidation = function (body) {
    var schema = joi_1.default.object({
        userName: joi_1.default.string().required().label('userName'),
        email: joi_1.default.string().email().required().label('Email'),
        password: (0, joi_password_complexity_1.default)().required().label('Password'),
    });
    return schema.validate(body);
};
exports.signUpBodyValidation = signUpBodyValidation;
var logInBodyValidation = function (body) {
    var schema = joi_1.default.object({
        email: joi_1.default.string().email().required().label('Email'),
        password: joi_1.default.string().required().label('Password'),
    });
    return schema.validate(body);
};
exports.logInBodyValidation = logInBodyValidation;
var refreshTokenBodyValidation = function (body) {
    var schema = joi_1.default.object({
        refreshToken: joi_1.default.string().required().label('Refresh Token'),
    });
    return schema.validate(body);
};
exports.refreshTokenBodyValidation = refreshTokenBodyValidation;
var createProfileValidation = function (body) {
    var schema = joi_1.default.object({
        dateOfBirth: joi_1.default.date().required().label('Date of birth'),
        gender: joi_1.default.any().required().valid('Male', 'Female'),
    });
    return schema.validate(body);
};
exports.createProfileValidation = createProfileValidation;
var updateProfileValidation = function (body) {
    var schema = joi_1.default.object({
        dateOfBirth: joi_1.default.date().label('Date of birth'),
        gender: joi_1.default.any().valid('Male', 'Female'),
        userName: joi_1.default.string().label('User Name'),
    });
    return schema.validate(body);
};
exports.updateProfileValidation = updateProfileValidation;
