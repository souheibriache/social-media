import chatController from '@controllers/chatController';
import { Router } from 'express';

const router = Router();

router.get('/', chatController.getMyChats);
router.post('/', chatController.create);
router.get('/:chatId', chatController.getChatById);
router.get('/:recipientId/messages', chatController.getChatByRecipientId);

export default router;
