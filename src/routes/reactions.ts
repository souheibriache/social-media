import reactionsRouter from '@controllers/reactionsRouter';
import postValidationSchema from '@util/validation/postValidationSchema';
import validateSchema from '@util/validation/validateSchema';
import { Router } from 'express';

const router = Router();

router.post('/', validateSchema(postValidationSchema.reactionSchema), reactionsRouter.createReaction);
router.delete('/', reactionsRouter.deleteReaction);
router.get('/', reactionsRouter.getPostReactions);

export default router;
