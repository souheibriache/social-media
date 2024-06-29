import postController from '@controllers/postController';
import postValidationSchema from '@util/validation/postValidationSchema';
import validateSchema from '@util/validation/validateSchema';
import { Router } from 'express';
import commentsRouter from './comments';
import reactionsRouter from './reactions';

const router = Router();

router.post('/', validateSchema(postValidationSchema.createPostValidationSchema), postController.createPost);
router.get('/', postController.getMyPosts);
router.get('/:postId', postController.getPostById);
router.put('/:postId', validateSchema(postValidationSchema.updatePostValidationSchema), postController.updatePost);
router.delete('/:postId');

router.use('/:postId/comments/', commentsRouter);
router.use('/:postId/reactions/', reactionsRouter);

export default router;
