import Profile from '@models/profile';
import User from '@models/users.schema';
import { Request, Response } from 'express';

const get = async (req: Request, res: Response) => {
  try {
    const { user, profile } = await findUserProfileOrFail(req.user._id);
    delete user.password;
    res.status(200).json({
      error: false,
      payload: {
        userName: user.userName,
        email: user.email,
        userId: user._id,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const userProfile = await Profile.findOne({ user: req.user._id });
    if (!!userProfile) return res.status(401).json({ error: true, message: 'Profile already exists' });

    const profile = await new Profile({
      ...req.body,
      user: req.user._id,
    }).save();
    return res.status(200).json({
      error: false,
      message: 'Profile created successfully',
      payload: { ...profile },
    });
  } catch (err) {
    console.log('Internal server error: ' + err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { userName, ...updateProfileData } = req.body;
    const { user, profile } = await findUserProfileOrFail(req.user._id);
    if (userName) await User.updateOne({ _id: user._id }, { userName });
    await Profile.updateOne({ user: user._id }, { ...updateProfileData });

    res.status(200).json({ error: false, message: 'User profile updated successfully' });
  } catch (err) {
    console.log('Internal server error :' + err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const findUserProfileOrFail = async (userId: string) => {
  const user = await User.findOne({ _id: userId });
  if (!user) throw new Error('User not found');
  const profile = await Profile.findOne({ user: userId });
  if (!profile) throw new Error('Profile not found');
  return { user, profile };
};

export default { get, create, update };
