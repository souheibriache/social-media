import { NextFunction } from 'express';
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

export const socketVerifyAccessToken = (socket: Socket, next: NextFunction) => {
  const { Authorization: authorization } = socket.handshake.auth;
  if (!authorization) {
    return next(new Error('Authentication error'));
  }

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') return next(new Error('Authentication error'));

  jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY!, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    socket.user = decoded;
    next();
  });
};
