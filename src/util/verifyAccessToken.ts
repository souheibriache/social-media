import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ACCESS_TOKEN_PRIVATE_KEY } = process.env;

    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ error: true, message: 'Unauthorized' });

    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer' || !token) return res.status(401).json({ error: true, message: 'Unauthorized' });

    await jwt.verify(token, ACCESS_TOKEN_PRIVATE_KEY, (err, tokenDetails) => {
      if (err) return res.status(401).json({ error: true, message: 'Unauthorized' });
      req.user = tokenDetails;
      console.log({ tokenDetails });
      next();
    });
  } catch (err) {
    console.log('Internal Server Error: ' + err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

export default verifyAccessToken;
