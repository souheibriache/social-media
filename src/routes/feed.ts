import postController from '@controllers/postController';
import verifyAccessToken from '@util/middleware/verifyAccessToken';
import { Router } from 'express';

const router = Router();

router.get('/', verifyAccessToken, postController.getUserFeed);

export default router;
