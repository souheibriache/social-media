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
import verifyAccessToken from '@util/middleware/verifyAccessToken';

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
// Handle errors
app.use(errorHandler());

// Handle not valid route
app.use('*', (req, res) => {
  res.status(404).json({ status: false, message: 'Endpoint Not Found' });
});

// Open Server on configurated Port

app.listen(PORT, () => console.info('Server listening on port ', PORT));
