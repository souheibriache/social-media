"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
var createPostValidationSchema = function (body) {
    var schema = joi_1.default.object({
        content: joi_1.default.string().required().label('Content'),
        visibility: joi_1.default.string().valid('only_me', 'friends', 'public').label('Visibility'),
    });
    return schema.validate(body);
};
var updatePostValidationSchema = function (body) {
    var schema = joi_1.default.object({
        content: joi_1.default.string().label('Content'),
        visibility: joi_1.default.string().valid('only_me', 'friends', 'public').label('Visibility'),
    });
    return schema.validate(body);
};
var postCommentValidationSchema = function (body) {
    var schema = joi_1.default.object({
        content: joi_1.default.string().required().label('Content'),
    });
    return schema.validate(body);
};
var reactionSchema = function (body) {
    var schema = joi_1.default.object({
        type: joi_1.default.string().valid('like', 'love', 'haha', 'angry', 'sad').label('Content'),
    });
    return schema.validate(body);
};
exports.default = { createPostValidationSchema: createPostValidationSchema, updatePostValidationSchema: updatePostValidationSchema, postCommentValidationSchema: postCommentValidationSchema, reactionSchema: reactionSchema };
