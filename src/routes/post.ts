import { Router } from 'express';

const router = Router();

router.post('/');
router.get('/');
router.get('/:postId');
router.put('/:postId');
router.delete('/:postId');

router.post('/:postId/comment');
router.get('/:postId/comment');
router.get('/:postId/comment/:commentId');
router.delete('/:postId/comment');

router.put('/:postId/react');

export default router;
