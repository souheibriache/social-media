import invitationController from '@controllers/invitationController';
import { Router } from 'express';

const router = Router();

router.post('/:userId', invitationController.sendInvitation);
router.post('/:userId', invitationController.unfriendUser);
router.post('/:invitationId/cancel', invitationController.cancelInvitation);
router.put('/:invitationId/accept', invitationController.acceptInvitation);
router.put('/:invitationId/reject', invitationController.rejectInvitation);
router.get('/sent', invitationController.getSentInvitations);
router.get('/received', invitationController.getReceivedInvitations);

export default router;
