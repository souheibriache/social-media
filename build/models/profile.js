'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var mongoose_1 = __importDefault(require('mongoose'));
var profileSchema = new mongoose_1.default.Schema({
  user: {
    type: mongoose_1.default.Schema.Types.ObjectId,
    ref: 'User',
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    default: 'Male',
  },
});
var Profile = mongoose_1.default.model('Profile', profileSchema);
exports.default = Profile;
