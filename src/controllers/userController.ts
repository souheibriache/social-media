import { Invitation } from '@models/invitation';
import Profile from '@models/profile';
import User from '@models/users.schema';
import { Request, Response } from 'express';

const get = async (req: Request, res: Response) => {
  try {
    const { user, profile } = await findUserProfileOrFail(req.user._id);
    if (!profile)
      return res.status(200).json({
        error: false,
        payload: {
          userName: user.userName,
          email: user.email,
          userId: user._id,
        },
      });

    delete user.password;
    res.status(200).json({
      error: false,
      payload: {
        userName: user.userName,
        email: user.email,
        userId: user._id,
        gender: profile?.gender,
        dateOfBirth: profile?.dateOfBirth,
        picture: profile?.picture,
      },
    });
  } catch (err) {
    console.log('Internal server error: ' + err);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const userProfile = await Profile.findOne({ user: req.user._id });
    if (userProfile) return res.status(401).json({ error: true, message: 'Profile already exists' });

    const profileData = {
      ...req.body,
      user: req.user._id,
    };

    if (req.files) {
      const pictureUrl = `/uploads/${req.files[0].filename}`;
      profileData.picture = pictureUrl;
    }

    const profile = await new Profile(profileData).save();
    const user = await User.findById(req.user._id);
    user.profile = profile.id;
    await user.save();

    return res.status(200).json({
      error: false,
      message: 'Profile created successfully',
      payload: profile,
    });
  } catch (err) {
    console.error('Internal server error: ', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { userName, ...profileData } = req.body;

    const user = await User.findById(req.user._id).populate('profile');
    if (!user) return res.status(404).json({ error: true, message: 'User not found' });

    // Update the user's profile
    if (userName) user.userName = userName;

    console.log({ reqFiles: req.file });
    if (profileData || req.file) {
      const updatedProfile = await Profile.findOne({ user: { _id: req.user._id } });
      if (profileData.dateOfBirth) updatedProfile.dateOfBirth = profileData.dateOfBirth;
      if (profileData.gender) updatedProfile.gender = profileData.gender;

      // Handle the profile picture if uploaded
      if (req.file) {
        const pictureUrl = `/uploads/${req.file.filename}`;
        updatedProfile.picture = pictureUrl;
        console.log({ updatedProfile });
      }

      await updatedProfile.save();
    }

    await user.save();
    const newUser = await User.findById(user._id).populate('profile');
    console.log({ newUser });
    return res.status(200).json({
      error: false,
      message: 'User profile updated successfully',
      payload: { user: newUser },
    });
  } catch (err) {
    console.error('Internal server error:', err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const findUserProfileOrFail = async (userId: string) => {
  const user = await User.findOne({ _id: userId });
  if (!user) throw new Error('User not found');
  const profile = await Profile.findOne({ user: userId });
  if (!profile) return { user, profile: null };
  return { user, profile };
};

const getAll = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user._id; // Assuming you have the current user's ID stored here
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const searchQuery = (req.query.search as string) || '';
    let query: any = {};

    // Exclude the current user from the query results
    query._id = { $ne: currentUserId };

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      query['userName'] = searchRegex;
    }

    // Fetch users
    const users = await User.find(query).select('-password').populate('profile').skip(skip).limit(pageSize).lean();

    // Add invitationStatus for each user
    const usersWithStatus = await Promise.all(
      users.map(async user => {
        const invitations = await Invitation.find({
          $or: [
            { sender: currentUserId, receiver: user._id },
            { sender: user._id, receiver: currentUserId },
          ],
        });

        let invitationStatus = 'none';

        if (invitations.length) {
          if (invitations.some(invitation => invitation.status === 'accepted')) {
            invitationStatus = 'friends';
          } else if (invitations.some(invitation => invitation.status === 'pending')) {
            const invitation = invitations.find(
              invitation => invitation.sender.equals(currentUserId) && invitation.status === 'pending'
            );
            if (invitation) {
              invitationStatus = 'invitationSent';
            } else {
              invitationStatus = 'invitationReceived';
            }
          }
        }

        return {
          ...user,
          invitationStatus,
        };
      })
    );

    const total = await User.countDocuments(query);

    const response = {
      error: false,
      message: 'Get users successfully',
      payload: {
        data: usersWithStatus,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / pageSize),
        },
      },
    };

    res.status(200).json(response);
  } catch (err) {
    console.error('Internal Server Error:', err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

const getOneById = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user._id;
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId }).populate('profile').lean();
    if (!user) return res.status(404).json({ error: true, message: 'User not found' });

    const invitations = await Invitation.find({
      $or: [
        { sender: currentUserId, receiver: user._id },
        { sender: user._id, receiver: currentUserId },
      ],
    });

    let invitationStatus = 'none';

    if (invitations.length) {
      if (invitations.some(invitation => invitation.status === 'accepted')) {
        invitationStatus = 'friends';
      } else if (invitations.some(invitation => invitation.status === 'pending')) {
        const invitation = invitations.find(
          invitation => invitation.sender.equals(currentUserId) && invitation.status === 'pending'
        );
        if (invitation) {
          invitationStatus = 'invitationSent';
        } else {
          invitationStatus = 'invitationReceived';
        }
      }
    }
    return res
      .status(200)
      .json({ error: false, message: 'Get user successfully', payload: { ...user, invitationStatus } });
  } catch (err) {
    console.error('Internal Server Error:', err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

export default { get, create, update, getAll, getOneById };
