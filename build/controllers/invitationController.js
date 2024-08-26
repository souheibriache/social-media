'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var invitation_1 = require('@models/invitation');
var users_schema_1 = __importDefault(require('@models/users.schema'));
var sendInvitation = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var receiverId, receiver, existingInvitation, err_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 4, , 5]);
          receiverId = req.params.userId;
          return [4 /*yield*/, users_schema_1.default.findOne({ _id: receiverId })];
        case 1:
          receiver = _a.sent();
          if (!receiver) res.status(404).json({ error: true, message: 'User Not Found!' });
          return [
            4 /*yield*/,
            invitation_1.Invitation.findOne({
              sender: req.user._id,
              receiver: receiverId,
              $or: [{ status: 'pending' }, { status: 'accepted' }],
            }),
          ];
        case 2:
          existingInvitation = _a.sent();
          if (existingInvitation)
            return [2 /*return*/, res.status(401).json({ error: true, message: 'Invitation Already Sent!' })];
          return [4 /*yield*/, new invitation_1.Invitation({ sender: req.user._id, receiver: receiverId }).save()];
        case 3:
          _a.sent();
          res.status(200).json({ error: false, message: 'Invitation Sent Successfully!' });
          return [3 /*break*/, 5];
        case 4:
          err_1 = _a.sent();
          console.log('Internal Server Error: ' + err_1);
          res.status(500).json({ error: true, message: 'Internal server error' });
          return [3 /*break*/, 5];
        case 5:
          return [2 /*return*/];
      }
    });
  });
};
var cancelInvitation = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var invitationId, invitation, err_2;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3, , 4]);
          invitationId = req.params.invitationId;
          return [
            4 /*yield*/,
            invitation_1.Invitation.findOne({
              id: invitationId,
              sender: req.user._id,
              $or: [{ status: 'pending' }, { status: 'accepted' }],
            }),
          ];
        case 1:
          invitation = _a.sent();
          if (!invitation)
            return [2 /*return*/, res.status(404).json({ error: true, message: 'Invitation Not Found!' })];
          return [
            4 /*yield*/,
            invitation_1.Invitation.findOneAndUpdate({ _id: invitationId }, { status: 'cancelled' }),
          ];
        case 2:
          _a.sent();
          res.status(200).json({ error: false, message: 'Invitation Cancelled Successfully!' });
          return [3 /*break*/, 4];
        case 3:
          err_2 = _a.sent();
          console.log('Internal Server Error: ' + err_2);
          res.status(500).json({ error: true, message: 'Internal server error' });
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
};
var unfriendUser = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var receiverId, receiver, invitation, err_3;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 4, , 5]);
          receiverId = req.params.userId;
          return [4 /*yield*/, users_schema_1.default.findOne({ _id: receiverId })];
        case 1:
          receiver = _a.sent();
          if (!receiver) res.status(404).json({ error: true, message: 'User Not Found!' });
          return [
            4 /*yield*/,
            invitation_1.Invitation.findOne({ sender: req.user._id, receiver: receiverId, status: 'accepted' }),
          ];
        case 2:
          invitation = _a.sent();
          if (!invitation)
            return [2 /*return*/, res.status(404).json({ error: true, message: 'Invitation Not Found!' })];
          return [
            4 /*yield*/,
            invitation_1.Invitation.findOneAndUpdate({ _id: invitation._id }, { status: 'cancelled' }),
          ];
        case 3:
          _a.sent();
          return [2 /*return*/, res.status(200).json({ error: false, message: 'User Unfriended Successfully!' })];
        case 4:
          err_3 = _a.sent();
          console.log('Internal Server Error: ' + err_3);
          res.status(500).json({ error: true, message: 'Internal server error' });
          return [3 /*break*/, 5];
        case 5:
          return [2 /*return*/];
      }
    });
  });
};
var acceptInvitation = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var invitationId, invitation, err_4;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3, , 4]);
          invitationId = req.params.invitationId;
          return [
            4 /*yield*/,
            invitation_1.Invitation.findOne({ _id: invitationId, status: 'pending', receiver: req.user._id }),
          ];
        case 1:
          invitation = _a.sent();
          if (!invitation)
            return [2 /*return*/, res.status(404).json({ error: true, message: 'Invitation Not Found!' })];
          return [
            4 /*yield*/,
            invitation_1.Invitation.findOneAndUpdate({ _id: invitation._id }, { status: 'accepted' }),
          ];
        case 2:
          _a.sent();
          return [2 /*return*/, res.status(200).json({ error: false, message: 'Invitation Accepted Successfully!' })];
        case 3:
          err_4 = _a.sent();
          console.log('Internal Server Error: ' + err_4);
          res.status(500).json({ error: true, message: 'Internal server error' });
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
};
var rejectInvitation = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var invitationId, invitation, err_5;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3, , 4]);
          invitationId = req.params.invitationId;
          return [
            4 /*yield*/,
            invitation_1.Invitation.findOne({ _id: invitationId, status: 'pending', receiver: req.user._id }),
          ];
        case 1:
          invitation = _a.sent();
          if (!invitation)
            return [2 /*return*/, res.status(404).json({ error: true, message: 'Invitation Not Found!' })];
          return [
            4 /*yield*/,
            invitation_1.Invitation.findOneAndUpdate({ _id: invitation._id }, { status: 'rejected' }),
          ];
        case 2:
          _a.sent();
          return [2 /*return*/, res.status(200).json({ error: false, message: 'Invitation Rejected Successfully!' })];
        case 3:
          err_5 = _a.sent();
          console.log('Internal Server Error: ' + err_5);
          res.status(500).json({ error: true, message: 'Internal server error' });
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
};
var getSentInvitations = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var invitaitonsData;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, getInvitation(req.user._id, 'sent')];
        case 1:
          invitaitonsData = _a.sent();
          return [2 /*return*/, res.status(invitaitonsData.statusCode).json(__assign({}, invitaitonsData.data))];
      }
    });
  });
};
var getReceivedInvitations = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var invitaitonsData;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, getInvitation(req.user._id, 'received')];
        case 1:
          invitaitonsData = _a.sent();
          return [2 /*return*/, res.status(invitaitonsData.statusCode).json(__assign({}, invitaitonsData.data))];
      }
    });
  });
};
var getInvitation = function (userId, invitationType) {
  return __awaiter(void 0, void 0, void 0, function () {
    var user, invitations, _a, err_6;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 6, , 7]);
          return [4 /*yield*/, users_schema_1.default.findOne({ _id: userId })];
        case 1:
          user = _b.sent();
          if (!user)
            return [
              2 /*return*/,
              {
                statusCode: 404,
                payload: {
                  message: 'User Not Found!',
                  error: true,
                },
              },
            ];
          if (!(invitationType === 'sent')) return [3 /*break*/, 3];
          return [
            4 /*yield*/,
            invitation_1.Invitation.find({ status: 'pending', sender: userId }).populate('receiver'),
          ];
        case 2:
          _a = _b.sent();
          return [3 /*break*/, 5];
        case 3:
          return [
            4 /*yield*/,
            invitation_1.Invitation.find({ status: 'pending', receiver: userId }).populate('sender'),
          ];
        case 4:
          _a = _b.sent();
          _b.label = 5;
        case 5:
          invitations = _a;
          return [
            2 /*return*/,
            {
              statusCode: 200,
              data: {
                error: false,
                message: 'Get Invitations Successfully!',
                payload: { invitations: invitations },
              },
            },
          ];
        case 6:
          err_6 = _b.sent();
          console.log('Internal Server Error: ' + err_6);
          return [
            2 /*return*/,
            {
              statusCode: 500,
              payload: {
                error: true,
                message: 'Internal server Error',
              },
            },
          ];
        case 7:
          return [2 /*return*/];
      }
    });
  });
};
exports.default = {
  sendInvitation: sendInvitation,
  acceptInvitation: acceptInvitation,
  rejectInvitation: rejectInvitation,
  cancelInvitation: cancelInvitation,
  unfriendUser: unfriendUser,
  getSentInvitations: getSentInvitations,
  getReceivedInvitations: getReceivedInvitations,
};
