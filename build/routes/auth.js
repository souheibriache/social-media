'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var express_1 = require('express');
var authController_1 = __importDefault(require('@controllers/authController'));
var router = (0, express_1.Router)();
router.post('/signup', authController_1.default.signup);
router.post('/login', authController_1.default.login);
exports.default = router;
