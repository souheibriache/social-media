import commentsController from '@controllers/commentsController';
import postValidationSchema from '@util/validation/postValidationSchema';
import validateSchema from '@util/validation/validateSchema';
import { Router } from 'express';

const router = Router();
router.post('/', validateSchema(postValidationSchema.postCommentValidationSchema), commentsController.postComment);
router.get('/', commentsController.getPostComments);
router.get('/:commentId', commentsController.getCommentById);
router.delete('/:commentId', commentsController.deleteComment);

export default router;
