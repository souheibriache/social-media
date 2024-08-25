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
Object.defineProperty(exports, '__esModule', { value: true });
var post_1 = require('@models/post');
var createPost = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var post, err_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          console.log(__assign({}, req.body));
          return [4 /*yield*/, new post_1.Post(__assign(__assign({}, req.body), { user: req.user._id })).save()];
        case 1:
          post = _a.sent();
          res.status(200).json({ error: false, message: 'Post created successfully', payload: { post: post } });
          return [3 /*break*/, 3];
        case 2:
          err_1 = _a.sent();
          console.log('Internal server error: ' + err_1);
          res.status(500).json({ error: true, message: 'Internal Server Error' });
          return [3 /*break*/, 3];
        case 3:
          return [2 /*return*/];
      }
    });
  });
};
var getMyPosts = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var sortOption, page, pageSize, skip, posts, total, response, err_2;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 3, , 4]);
          sortOption = req.query.sortOption || 'createdAt';
          page = parseInt(req.query.page) || 1;
          pageSize = 10;
          skip = (page - 1) * pageSize;
          return [
            4 /*yield*/,
            post_1.Post.find({ user: req.user._id })
              .populate({ path: 'comments' })
              .sort(((_a = {}), (_a[sortOption] = 1), _a))
              .skip(skip)
              .limit(pageSize)
              .lean(),
          ];
        case 1:
          posts = _b.sent();
          return [4 /*yield*/, post_1.Post.countDocuments({ user: req.user._id })];
        case 2:
          total = _b.sent();
          response = {
            error: false,
            message: 'Get my posts successfully',
            payload: {
              data: posts,
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
          err_2 = _b.sent();
          console.log('Internal server error: ' + err_2);
          res.status(500).json({ error: true, message: 'Internal Server Error' });
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
};
var getPostById = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var postId, post, err_3;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          postId = req.params.postId;
          return [
            4 /*yield*/,
            post_1.Post.findOne({ _id: postId, user: req.user._id })
              .populate({
                path: 'comments',
                populate: {
                  path: 'user',
                  select: 'userName email', // Adjust the fields you want to populate from the User schema
                },
              })
              .populate({
                path: 'reactions',
                populate: {
                  path: 'user',
                  select: 'userName email', // Adjust the fields you want to populate from the User schema
                },
              }),
          ];
        case 1:
          post = _a.sent();
          if (!post) return [2 /*return*/, res.status(404).json({ error: true, message: 'Post Not Found!' })];
          return [
            2 /*return*/,
            res.status(200).json({ error: false, message: 'Get Post successfully', payload: { post: post } }),
          ];
        case 2:
          err_3 = _a.sent();
          console.log('Internal server error: ' + err_3);
          res.status(500).json({ error: true, message: 'Internal Server Error' });
          return [3 /*break*/, 3];
        case 3:
          return [2 /*return*/];
      }
    });
  });
};
var updatePost = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var postId, post, err_4;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3, , 4]);
          postId = req.params.postId;
          return [4 /*yield*/, post_1.Post.findOne({ _id: postId, user: req.user._id })];
        case 1:
          post = _a.sent();
          if (!post) return [2 /*return*/, res.status(404).json({ error: true, message: 'Post Not Found!' })];
          return [4 /*yield*/, post_1.Post.updateOne({ _id: postId }, req.body)];
        case 2:
          _a.sent();
          res.status(200).json({ error: false, message: 'Post Updated Successfully' });
          return [3 /*break*/, 4];
        case 3:
          err_4 = _a.sent();
          console.log('Internal server error: ' + err_4);
          res.status(500).json({ error: true, message: 'Internal Server Error' });
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
};
exports.default = {
  createPost: createPost,
  getMyPosts: getMyPosts,
  getPostById: getPostById,
  updatePost: updatePost,
};
