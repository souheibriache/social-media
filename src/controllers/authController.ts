import User from '@models/users.schema';
import { logInBodyValidation, signUpBodyValidation } from '@util/validationSchema';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateTokens } from '@util/generateTokens';
require('dotenv');
const SALT = process.env.SALT as string;
const { ACCESS_TOKEN_PRIVATE_KEY: accessTokenPrivateKey } = process.env;
const { REFRESH_TOKEN_PRIVATE_KEY: refreshTokenPrivateKey } = process.env;
export const signup = async (req: Request, res: Response) => {
  try {
    const { error } = signUpBodyValidation(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (user)
      return res.status(400).json({
        error: true,
        message: 'User with given email already exists!',
      });

    const hashedPassword = await hash(req.body.password);
    await new User({ ...req.body, password: hashedPassword }).save();
    res.status(200).json({
      error: false,
      message: 'Account Created Successfully',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: 'Internal Server Error!' });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { error } = logInBodyValidation(req.body);
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: true, message: 'Invalid Email or Password' });

    const verifiedPassword = await compare(password, user.password);
    if (!verifiedPassword) res.status(401).json({ error: true, messahe: 'Invalid Email or Password' });

    const { accessToken, refreshToken } = await generateTokens(user);
    res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      message: 'Logged in successfully',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

async function hash(password: string) {
  const salt = await bcrypt.genSalt(Number(SALT));
  return await bcrypt.hash(password, salt);
}

async function compare(passwprd: string, hashedPassword: any) {
  return await bcrypt.compareSync(passwprd, hashedPassword);
}

export default {
  login,
  signup,
};
