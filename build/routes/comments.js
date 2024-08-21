"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commentsController_1 = __importDefault(require("@controllers/commentsController"));
var postValidationSchema_1 = __importDefault(require("@util/validation/postValidationSchema"));
var validateSchema_1 = __importDefault(require("@util/validation/validateSchema"));
var express_1 = require("express");
var router = (0, express_1.Router)({ mergeParams: true });
router.post('/', (0, validateSchema_1.default)(postValidationSchema_1.default.postCommentValidationSchema), commentsController_1.default.postComment);
router.get('/', commentsController_1.default.getPostComments);
router.get('/:commentId', commentsController_1.default.getCommentById);
router.delete('/:commentId', commentsController_1.default.deleteComment);
exports.default = router;
