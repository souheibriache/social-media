import postController from '@controllers/postController';
import postValidationSchema from '@util/validation/postValidationSchema';
import validateSchema from '@util/validation/validateSchema';
import { Router } from 'express';

const router = Router();

router.post('/', validateSchema(postValidationSchema.createPostValidationSchema), postController.createPost);
router.get('/', postController.getMyPosts);
router.get('/:postId', postController.getPostById);
router.put('/:postId', validateSchema(postValidationSchema.updatePostValidationSchema), postController.updatePost);
router.delete('/:postId');

router.post(
  '/:postId/comments',
  validateSchema(postValidationSchema.postCommentValidationSchema),
  postController.postComment
);
router.get('/:postId/comments', postController.getPostComments);
router.get('/:postId/comments/:commentId', postController.getCommentById);
router.delete('/:postId/comments/:commentId', postController.deleteComment);

router.post('/:postId/reactions', validateSchema(postValidationSchema.reactionSchema), postController.createReaction);
router.delete('/:postId/reactions', postController.deleteReaction);
router.get('/:postId/reactions', postController.getPostReactions);

export default router;
