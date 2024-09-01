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
import chatRouter from './routes/chat';
import feedRouter from './routes/feed';
import http from 'http';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import { Chat, IChat, Message } from '@models/chat';

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
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

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
app.use('/api/chat', verifyAccessToken, chatRouter);
app.use('/api/feed', verifyAccessToken, feedRouter);
// Handle errors
app.use(errorHandler());

// Handle not valid route
app.use('*', (req, res) => {
  res.status(404).json({ status: false, message: 'Endpoint Not Found' });
});

// Open Server on configurated Port
import { socketVerifyAccessToken } from '@util/middleware/socketVerifyToken';
import mongoose from 'mongoose';
import User from '@models/users.schema';

// const channel = connectRabbitMQ();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.use(socketVerifyAccessToken);

io.on('connection', async socket => {
  console.log('User connected:', socket.user._id);
  await User.updateOne({ _id: socket.user._id }, { socket: socket.id });
  socket.join(socket.user._id);

  // Send a message
  socket.on('send_message', async data => {
    try {
      const { recipientId, content } = JSON.parse(data);
      let chat: IChat;
      const existingChat = await Chat.findOne({ participants: { $all: [recipientId, socket.user._id] } }).populate(
        'messages'
      );
      if (existingChat) chat = existingChat;
      else {
        const newChat = new Chat({ participants: [socket.user._id, recipientId] });
        chat = await newChat.save();
      }

      const newMessage = new Message({
        content,
        sender: socket.user._id,
        chat: chat._id,
      });
      await newMessage.save();
      const consolelogChat = await Chat.findById(chat._id).populate({
        path: 'messages',
        select: 'content',
      });

      chat.messages.push(newMessage._id as mongoose.Types.ObjectId);
      await chat.save();
      const message = await Message.findById(newMessage._id).populate({
        path: 'sender',
        select: 'userName profile',
        populate: {
          path: 'profile',
          select: 'dateOfBirth gender picture', // Populate the profile fields you need
        },
      });
      socket.in([recipientId]).emit('new_message', message);

      socket.emit('message_sent', message);
    } catch (error) {
      console.error('Socket error :', error);
    }

    // Publish the message to RabbitMQ
    // await channel.sendToQueue('chat_messages', Buffer.from(JSON.stringify({ chatId, messageId: newMessage._id })));
  });

  socket.on('see_messages', async data => {
    try {
      const { chatId } = JSON.parse(data);
      const chat: any = await Chat.findOne({ _id: chatId }).populate('participants');
      if (!chat) throw new Error('Chat not found!');
      await Message.updateMany(
        { chat: chatId, sender: { $ne: socket.user._id }, seenAt: null },
        { seenAt: new Date() }
      );
      const newChatMessages = await Message.find({ chat: chatId });
      const receiverId = chat.participants.find(partisipant => partisipant._id !== socket.user._id)._id.toString();
      socket.in(receiverId).emit('update_messages', newChatMessages);
    } catch (error) {
      console.log('Socket error :', error);
    }
  });

  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.user._id);
    await User.updateOne({ _id: socket.user._id }, { socket: null });
    socket.leave(socket.user._id);
  });
});
server.listen(3003, () => console.info('Socket listening on port ', 3003));

app.listen(PORT, () => console.info('Server listening on port ', PORT));
