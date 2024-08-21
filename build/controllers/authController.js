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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
var users_schema_1 = __importDefault(require("@models/users.schema"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var generateTokens_1 = require("@util/generateTokens");
var validationSchema_1 = require("@util/validation/validationSchema");
require('dotenv');
var SALT = process.env.SALT;
var signup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error, user, hashedPassword, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                error = (0, validationSchema_1.signUpBodyValidation)(req.body).error;
                if (error)
                    return [2 /*return*/, res.status(400).json({ error: true, message: error.details[0].message })];
                return [4 /*yield*/, users_schema_1.default.findOne({ email: req.body.email })];
            case 1:
                user = _a.sent();
                if (user)
                    return [2 /*return*/, res.status(400).json({
                            error: true,
                            message: 'User with given email already exists!',
                        })];
                return [4 /*yield*/, hash(req.body.password)];
            case 2:
                hashedPassword = _a.sent();
                return [4 /*yield*/, new users_schema_1.default(__assign(__assign({}, req.body), { password: hashedPassword })).save()];
            case 3:
                _a.sent();
                res.status(200).json({
                    error: false,
                    message: 'Account Created Successfully',
                });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.log(err_1);
                res.status(500).json({ error: true, message: 'Internal Server Error!' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.signup = signup;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error, _a, email, password, user, verifiedPassword, _b, accessToken, refreshToken, err_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                error = (0, validationSchema_1.logInBodyValidation)(req.body).error;
                if (error)
                    return [2 /*return*/, res.status(400).json({ error: true, message: error.details[0].message })];
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, users_schema_1.default.findOne({ email: email })];
            case 1:
                user = _c.sent();
                if (!user)
                    return [2 /*return*/, res.status(401).json({ error: true, message: 'Invalid Email or Password' })];
                return [4 /*yield*/, compare(password, user.password)];
            case 2:
                verifiedPassword = _c.sent();
                if (!verifiedPassword)
                    res.status(401).json({ error: true, messahe: 'Invalid Email or Password' });
                return [4 /*yield*/, (0, generateTokens_1.generateTokens)(user)];
            case 3:
                _b = _c.sent(), accessToken = _b.accessToken, refreshToken = _b.refreshToken;
                res.status(200).json({
                    error: false,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    message: 'Logged in successfully',
                });
                return [3 /*break*/, 5];
            case 4:
                err_2 = _c.sent();
                console.log(err_2);
                res.status(500).json({ error: true, message: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
function hash(password) {
    return __awaiter(this, void 0, void 0, function () {
        var salt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcrypt_1.default.genSalt(Number(SALT))];
                case 1:
                    salt = _a.sent();
                    return [4 /*yield*/, bcrypt_1.default.hash(password, salt)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function compare(passwprd, hashedPassword) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcrypt_1.default.compareSync(passwprd, hashedPassword)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.default = {
    login: login,
    signup: exports.signup,
};
