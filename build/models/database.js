'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var mongoose_1 = __importDefault(require('mongoose'));
var dbConnect = function (dbUri) {
  mongoose_1.default.connect(dbUri);
  mongoose_1.default.connection.on('connected', function () {
    console.log('Connected to database successfully');
  });
  mongoose_1.default.connection.on('error', function (err) {
    console.log('Error while connecting to database: ' + err);
  });
  mongoose_1.default.connection.on('disconnected', function () {
    console.log('Mongodb Connection disconnected');
  });
};
exports.default = dbConnect;
