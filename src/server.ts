// Register module/require aliases
import 'module-alias/register';

// Patches
import { inject, errorHandler } from 'express-custom-error';
inject(); // Patch express in order to use async / await syntax

// Require Dependencies
import env from 'mandatoryenv';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
require('dotenv');
import logger from '@util/logger';
import dbConnect from '@models/database';
import authRouter from './routes/auth';
import refreshTokenRouter from './routes/refreshToken';
import profileRouter from './routes/user';
import postRouter from './routes/post';
import invitationRouter from './routes/invitation';
import verifyAccessToken from '@util/middleware/verifyAccessToken';
import http from 'http';
import { Server } from 'socket.io';
import socketVerifyAccessToken from '@util/middleware/verifyWsAccessToken';

// Load .env Enviroment Variables to process.env

env.load(['DB_URL', 'PORT', 'SECRET']);

//? Connect to mongodb database
const dbUri = process.env.DB_URL;
dbConnect(dbUri);

const { PORT } = process.env;

// Instantiate an Express Application

const app = express();

// Configure Express App Instance
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure custom logger middleware
app.use(logger.dev, logger.combined);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());
app.use(helmet());

// This middleware adds the json header to every response
app.use('*', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Assign Routes
app.use('/api', authRouter);
app.use('/api/refreshToken', refreshTokenRouter);
app.use('/api/profile', verifyAccessToken, profileRouter);
app.use('/api/posts', verifyAccessToken, postRouter);
app.use('/api/invitations', verifyAccessToken, invitationRouter);
// Handle errors
app.use(errorHandler());

// Handle not valid route
app.use('*', (req, res) => {
  res.status(404).json({ status: false, message: 'Endpoint Not Found' });
});

// Open Server on configurated Port

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.use(socketVerifyAccessToken);

io.on('connection', socket => {
  console.log('A user connected: ', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id);
  });

  socket.on('send_message', message => {
    // Handle the message here
    // Broadcast the message to other users
    console.log({ message });
    socket.broadcast.emit('receive_message', message);
  });
});

server.listen(3002, () => {
  console.info('Server listening on port ', 3002);
});

app.listen(PORT, () => console.info('Server listening on port ', PORT));
