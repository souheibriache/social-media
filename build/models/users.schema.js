'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var mongoose_1 = __importDefault(require('mongoose'));
var usersSchema = new mongoose_1.default.Schema({
  _id: {
    type: mongoose_1.default.Schema.Types.ObjectId,
    required: true,
    auto: true,
    default: new mongoose_1.default.Types.ObjectId(),
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    enum: ['user', 'admin', 'super_admin'],
    default: ['user'],
  },
  status: {
    type: String,
    enum: ['active', 'disactivated', 'disabled'],
    default: 'active',
  },
});
var User = mongoose_1.default.model('Users', usersSchema);
exports.default = User;
