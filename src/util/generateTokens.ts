import RefreshToken from '@models/refresh-token';
import { UsersType } from '@models/users.schema';
import jwt from 'jsonwebtoken';

type PayloadType = {
  _id: string;
  roles: string[];
  hasProfile: boolean;
};

export const generateTokens = async (
  user: UsersType,
  hasProfile: any
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const { ACCESS_TOKEN_PRIVATE_KEY } = process.env;
    const { REFRESH_TOKEN_PRIVATE_KEY } = process.env;
    const payload: PayloadType = {
      _id: user._id.toString(),
      roles: user.roles,
      hasProfile,
    };

    const accessToken: string = jwt.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: '1h',
    });
    const refreshToken: string = jwt.sign(payload, REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: '30d',
    });

    const userToken = await RefreshToken.findOne({ userId: user._id });
    if (!!userToken) await RefreshToken.deleteOne({ userId: user._id });
    await new RefreshToken({
      userId: user._id,
      token: refreshToken,
    }).save();
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};
