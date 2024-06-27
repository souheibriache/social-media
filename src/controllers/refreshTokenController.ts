import RefreshToken from '@models/refresh-token';
import { refreshTokenBodyValidation } from '@util/validation/validationSchema';
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';

const refreshToken = async (req: Request, res: Response) => {
  try {
    const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;
    const payload = { _id: req.user._id, roles: req.user.roles };
    const accessToken = jwt.sign(payload, privateKey, { expiresIn: '14m' });

    res.status(200).json({
      error: false,
      accessToken,
      message: 'Access Token Refreshed Successfully',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

const deleteRefreshToken = async (req: Request, res: Response) => {
  try {
    const { error } = refreshTokenBodyValidation(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });

    const { refreshToken } = req.body;
    const userToken = await RefreshToken.findOne({ token: refreshToken });
    if (!userToken) return res.status(200).json({ error: false, message: 'Logged Out Sucessfully' });

    await RefreshToken.deleteOne({ token: refreshToken });
    res.status(200).json({ error: false, message: 'Logged Out Sucessfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

export default {
  deleteRefreshToken,
  refreshToken,
};
