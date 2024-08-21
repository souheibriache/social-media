"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = exports.Reaction = exports.Post = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var commentsSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Users',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    content: {
        type: String,
        required: true,
    },
    post: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Post',
    },
});
var reactionSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    type: {
        type: String,
        enum: ['like', 'love', 'haha', 'angry', 'sad'],
        default: 'like',
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Users',
    },
    post: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Post',
    },
});
var postSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Users',
    },
    content: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    visibility: {
        type: String,
        enum: ['only_me', 'friends', 'public'],
        default: 'friends',
    },
    reactions: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Reaction',
        },
    ],
    comments: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    images: [
        {
            type: String,
        },
    ],
});
// export type ReactionType = InferSchemaType<typeof reactionSchema>;
exports.Post = mongoose_1.default.model('Post', postSchema);
exports.Reaction = mongoose_1.default.model('Reaction', reactionSchema);
exports.Comment = mongoose_1.default.model('Comment', commentsSchema);
