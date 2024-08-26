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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var profile_1 = __importDefault(require('@models/profile'));
var users_schema_1 = __importDefault(require('@models/users.schema'));
var get = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, profile, err_1;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          return [4 /*yield*/, findUserProfileOrFail(req.user._id)];
        case 1:
          (_a = _b.sent()), (user = _a.user), (profile = _a.profile);
          delete user.password;
          res.status(200).json({
            error: false,
            payload: {
              userName: user.userName,
              email: user.email,
              userId: user._id,
              gender: profile.gender,
              dateOfBirth: profile.dateOfBirth,
            },
          });
          return [3 /*break*/, 3];
        case 2:
          err_1 = _b.sent();
          return [2 /*return*/, res.status(500).json({ error: true, message: 'Internal server error' })];
        case 3:
          return [2 /*return*/];
      }
    });
  });
};
var create = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var userProfile, profile, err_2;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3, , 4]);
          return [4 /*yield*/, profile_1.default.findOne({ user: req.user._id })];
        case 1:
          userProfile = _a.sent();
          if (!!userProfile)
            return [2 /*return*/, res.status(401).json({ error: true, message: 'Profile already exists' })];
          return [4 /*yield*/, new profile_1.default(__assign(__assign({}, req.body), { user: req.user._id })).save()];
        case 2:
          profile = _a.sent();
          return [
            2 /*return*/,
            res.status(200).json({
              error: false,
              message: 'Profile created successfully',
              payload: __assign({}, profile),
            }),
          ];
        case 3:
          err_2 = _a.sent();
          console.log('Internal server error: ' + err_2);
          res.status(500).json({ error: true, message: 'Internal server error' });
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
};
var update = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, userName, updateProfileData, _b, user, profile, err_3;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          _c.trys.push([0, 5, , 6]);
          (_a = req.body), (userName = _a.userName), (updateProfileData = __rest(_a, ['userName']));
          return [4 /*yield*/, findUserProfileOrFail(req.user._id)];
        case 1:
          (_b = _c.sent()), (user = _b.user), (profile = _b.profile);
          if (!userName) return [3 /*break*/, 3];
          return [4 /*yield*/, users_schema_1.default.updateOne({ _id: user._id }, { userName: userName })];
        case 2:
          _c.sent();
          _c.label = 3;
        case 3:
          return [4 /*yield*/, profile_1.default.updateOne({ user: user._id }, __assign({}, updateProfileData))];
        case 4:
          _c.sent();
          res.status(200).json({ error: false, message: 'User profile updated successfully' });
          return [3 /*break*/, 6];
        case 5:
          err_3 = _c.sent();
          console.log('Internal server error :' + err_3);
          res.status(500).json({ error: true, message: 'Internal server error' });
          return [3 /*break*/, 6];
        case 6:
          return [2 /*return*/];
      }
    });
  });
};
var findUserProfileOrFail = function (userId) {
  return __awaiter(void 0, void 0, void 0, function () {
    var user, profile;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, users_schema_1.default.findOne({ _id: userId })];
        case 1:
          user = _a.sent();
          if (!user) throw new Error('User not found');
          return [4 /*yield*/, profile_1.default.findOne({ user: userId })];
        case 2:
          profile = _a.sent();
          if (!profile) throw new Error('Profile not found');
          return [2 /*return*/, { user: user, profile: profile }];
      }
    });
  });
};
var getAll = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var page, pageSize, query, skip, searchQuery, searchRegex, users, total, response, err_4;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3, , 4]);
          page = parseInt(req.query.page) || 1;
          pageSize = 10;
          query = {};
          skip = (page - 1) * pageSize;
          searchQuery = req.query.search || '';
          if (searchQuery) {
            searchRegex = new RegExp(searchQuery, 'i');
            query['userName'] = searchRegex;
          }
          return [4 /*yield*/, users_schema_1.default.find(query).skip(skip).limit(pageSize).lean()];
        case 1:
          users = _a.sent();
          return [4 /*yield*/, users_schema_1.default.countDocuments(query)];
        case 2:
          total = _a.sent();
          response = {
            error: false,
            message: 'Get my posts successfully',
            payload: {
              data: users,
              pagination: {
                total: total,
                page: page,
                pages: Math.ceil(total / pageSize),
              },
            },
          };
          res.status(200).json(response);
          return [3 /*break*/, 4];
        case 3:
          err_4 = _a.sent();
          console.log('Internal Server Error: ' + err_4);
          return [2 /*return*/, res.status(500).json({ error: true, message: 'Internal Server Error' })];
        case 4:
          return [2 /*return*/];
      }
    });
  });
};
exports.default = { get: get, create: create, update: update, getAll: getAll };
