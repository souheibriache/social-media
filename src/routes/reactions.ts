import reactionsController from '@controllers/reactionsController';
import postValidationSchema from '@util/validation/postValidationSchema';
import validateSchema from '@util/validation/validateSchema';
import { Router } from 'express';

const router = Router({ mergeParams: true });

router.post('/', validateSchema(postValidationSchema.reactionSchema), reactionsController.createReaction);
router.delete('/', reactionsController.deleteReaction);
router.get('/', reactionsController.getPostReactions);

export default router;
