import RefreshToken from '@models/refresh-token';
import { refreshTokenBodyValidation } from '@util/validation/validationSchema';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;
    const { refreshToken } = req.body;
    if (!refreshToken) res.status(400).json({ error: true, message: 'Invalid refresh token 1' });
    const existingRefreshToken = await RefreshToken.findOne({
      token: refreshToken,
    });

    const { error } = refreshTokenBodyValidation(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    if (!existingRefreshToken) res.status(400).json({ error: true, message: 'Invalid refresh token 2' });

    const jwtPayload = await jwt.verify(refreshToken, privateKey);
    req.user = jwtPayload;
    next();
  } catch (err) {
    console.log('Internal server error: ' + err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
};
export default verifyRefreshToken;
