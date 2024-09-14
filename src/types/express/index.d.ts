import { File } from 'multer';
export {};

declare global {
  namespace Express {
    interface Request {
      user: { _id: string; roles: string[]; hasProfile: boolean };
      files?: File[];
      file?: File;
    }
    interface Response {}
  }
}

declare module 'socket.io' {
  interface Socket {
    user?: { _id: string; roles: string[]; hasProfile: boolean };
  }
}
