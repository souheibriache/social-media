'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var invitationController_1 = __importDefault(require('@controllers/invitationController'));
var express_1 = require('express');
var router = (0, express_1.Router)();
router.post('/:userId', invitationController_1.default.sendInvitation);
router.post('/:userId', invitationController_1.default.unfriendUser);
router.post('/:invitationId/cancel', invitationController_1.default.cancelInvitation);
router.put('/:invitationId/accept', invitationController_1.default.acceptInvitation);
router.put('/:invitationId/reject', invitationController_1.default.rejectInvitation);
router.get('/sent', invitationController_1.default.getSentInvitations);
router.get('/received', invitationController_1.default.getReceivedInvitations);
exports.default = router;
