'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Invitation = void 0;
var mongoose_1 = __importDefault(require('mongoose'));
var invitationSchema = new mongoose_1.default.Schema({
  _id: {
    type: mongoose_1.default.Schema.Types.ObjectId,
    auto: true,
    required: true,
  },
  sender: {
    type: mongoose_1.default.Schema.Types.ObjectId,
    ref: 'Users',
  },
  receiver: {
    type: mongoose_1.default.Schema.Types.ObjectId,
    ref: 'Users',
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending',
  },
});
exports.Invitation = mongoose_1.default.model('Invitation', invitationSchema);
