"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var refreshTokenController_1 = __importDefault(require("@controllers/refreshTokenController"));
var verifyRefreshToken_1 = __importDefault(require("@util/middleware/verifyRefreshToken"));
var router = (0, express_1.Router)();
router.post('/', verifyRefreshToken_1.default, refreshTokenController_1.default.refreshToken);
// logout
router.delete('/', refreshTokenController_1.default.deleteRefreshToken);
exports.default = router;
