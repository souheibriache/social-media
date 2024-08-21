"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Register module/require aliases
require("module-alias/register");
// Patches
var express_custom_error_1 = require("express-custom-error");
(0, express_custom_error_1.inject)(); // Patch express in order to use async / await syntax
// Require Dependencies
var mandatoryenv_1 = __importDefault(require("mandatoryenv"));
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
require('dotenv');
var logger_1 = __importDefault(require("@util/logger"));
var database_1 = __importDefault(require("@models/database"));
var auth_1 = __importDefault(require("./routes/auth"));
var refreshToken_1 = __importDefault(require("./routes/refreshToken"));
var user_1 = __importDefault(require("./routes/user"));
var post_1 = __importDefault(require("./routes/post"));
var invitation_1 = __importDefault(require("./routes/invitation"));
var verifyAccessToken_1 = __importDefault(require("@util/middleware/verifyAccessToken"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = require("socket.io");
var verifyWsAccessToken_1 = __importDefault(require("@util/middleware/verifyWsAccessToken"));
// Load .env Enviroment Variables to process.env
mandatoryenv_1.default.load(['DB_URL', 'PORT', 'SECRET']);
//? Connect to mongodb database
var dbUri = process.env.DB_URL;
(0, database_1.default)(dbUri);
var PORT = process.env.PORT;
// Instantiate an Express Application
var app = (0, express_1.default)();
// Configure Express App Instance
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Configure custom logger middleware
app.use(logger_1.default.dev, logger_1.default.combined);
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
// This middleware adds the json header to every response
app.use('*', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
});
// Assign Routes
app.use('/api', auth_1.default);
app.use('/api/refreshToken', refreshToken_1.default);
app.use('/api/profile', verifyAccessToken_1.default, user_1.default);
app.use('/api/posts', verifyAccessToken_1.default, post_1.default);
app.use('/api/invitations', verifyAccessToken_1.default, invitation_1.default);
// Handle errors
app.use((0, express_custom_error_1.errorHandler)());
// Handle not valid route
app.use('*', function (req, res) {
    res.status(404).json({ status: false, message: 'Endpoint Not Found' });
});
// Open Server on configurated Port
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
io.use(verifyWsAccessToken_1.default);
io.on('connection', function (socket) {
    console.log('A user connected: ', socket.id);
    socket.on('disconnect', function () {
        console.log('User disconnected: ', socket.id);
    });
    socket.on('send_message', function (message) {
        // Handle the message here
        // Broadcast the message to other users
        console.log({ message: message });
        socket.broadcast.emit('receive_message', message);
    });
});
server.listen(3002, function () {
    console.info('Server listening on port ', 3002);
});
app.listen(PORT, function () { return console.info('Server listening on port ', PORT); });
