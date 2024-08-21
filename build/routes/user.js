"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var userController_1 = __importDefault(require("@controllers/userController"));
var validateSchema_1 = __importDefault(require("@util/validation/validateSchema"));
var validationSchema_1 = require("@util/validation/validationSchema");
var router = (0, express_1.Router)();
router.get('/', userController_1.default.get);
router.post('/', (0, validateSchema_1.default)(validationSchema_1.createProfileValidation), userController_1.default.create);
router.put('/', (0, validateSchema_1.default)(validationSchema_1.updateProfileValidation), userController_1.default.update);
router.get('/search', userController_1.default.getAll);
exports.default = router;
