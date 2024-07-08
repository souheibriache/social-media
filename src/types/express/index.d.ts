import { Socket } from 'socket.io';

export {};

declare global {
  namespace Express {
    interface Request {
      user: { _id: string; roles: string[] };
    }
    interface Response {}
  }
}
