'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var postController_1 = __importDefault(require('@controllers/postController'));
var postValidationSchema_1 = __importDefault(require('@util/validation/postValidationSchema'));
var validateSchema_1 = __importDefault(require('@util/validation/validateSchema'));
var express_1 = require('express');
var comments_1 = __importDefault(require('./comments'));
var reactions_1 = __importDefault(require('./reactions'));
var router = (0, express_1.Router)();
router.post(
  '/',
  (0, validateSchema_1.default)(postValidationSchema_1.default.createPostValidationSchema),
  postController_1.default.createPost
);
router.get('/', postController_1.default.getMyPosts);
router.get('/:postId', postController_1.default.getPostById);
router.put(
  '/:postId',
  (0, validateSchema_1.default)(postValidationSchema_1.default.updatePostValidationSchema),
  postController_1.default.updatePost
);
router.delete('/:postId');
router.use('/:postId/comments/', comments_1.default);
router.use('/:postId/reactions/', reactions_1.default);
exports.default = router;
