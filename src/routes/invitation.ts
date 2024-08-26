import invitationController from '@controllers/invitationController';
import { Router } from 'express';

const router = Router();

router.post('/:userId/add', invitationController.sendInvitation);
router.put('/:userId/unfriend', invitationController.unfriendUser);
router.put('/:userId/cancel', invitationController.cancelInvitation);
router.put('/:userId/accept', invitationController.acceptInvitation);
router.put('/:userId/reject', invitationController.rejectInvitation);
router.get('/sent', invitationController.getSentInvitations);
router.get('/received', invitationController.getReceivedInvitations);

export default router;
