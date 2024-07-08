import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

const socketVerifyAccessToken = (socket: Socket, next: (err?: any) => void) => {
  try {
    const { ACCESS_TOKEN_PRIVATE_KEY } = process.env;
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Unauthorized'));
    }

    jwt.verify(token, ACCESS_TOKEN_PRIVATE_KEY, (err, decoded) => {
      if (err) {
        return next(new Error('Unauthorized'));
      }
      socket.data.user = decoded;
      next();
    });
  } catch (err) {
    console.error('Internal Server Error:', err);
    next(new Error('Internal Server Error'));
  }
};

export default socketVerifyAccessToken;
