import { Invitation } from '@models/invitation';
import { Post } from '@models/post';
import { Request, Response } from 'express';

const createPost = async (req: Request, res: Response) => {
  try {
    const post = await new Post({ ...req.body, user: req.user._id }).save();
    if (req.files) {
      for (const file of req.files) {
        const pictureUrl = `/uploads/${file.filename}`;
        post.images.push(pictureUrl);
      }
    }
    await post.save();
    const newPost = await Post.findById(post._id).populate({
      path: 'user',
      select: 'userName',
      populate: {
        path: 'profile',
        select: 'picture',
      },
    });
    res.status(200).json({ error: false, message: 'Post created successfully', payload: { post: newPost } });
  } catch (err) {
    console.log('Internal server error: ' + err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

const getMyPosts = async (req: Request, res: Response) => {
  try {
    const sortOption = (req.query.sortOption as string) || 'createdAt';
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const posts = await Post.find({ user: req.user._id })
      .populate({ path: 'comments' })
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();
    const total = await Post.countDocuments({ user: req.user._id });
    const response = {
      error: false,
      message: 'Get my posts successfully',
      payload: {
        data: posts,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / pageSize),
        },
      },
    };
    res.status(200).json(response);
  } catch (err) {
    console.log('Internal server error: ' + err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};
const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findOne({ _id: postId, user: req.user._id })
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'userName email', // Adjust the fields you want to populate from the User schema
        },
      })
      .populate({
        path: 'reactions',
        populate: {
          path: 'user',
          select: 'userName email', // Adjust the fields you want to populate from the User schema
        },
      });

    if (!post) return res.status(404).json({ error: true, message: 'Post Not Found!' });

    return res.status(200).json({ error: false, message: 'Get Post successfully', payload: { post } });
  } catch (err) {
    console.log('Internal server error: ' + err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findOne({ _id: postId, user: req.user._id });
    if (!post) return res.status(404).json({ error: true, message: 'Post Not Found!' });

    await Post.updateOne({ _id: postId }, req.body);
    res.status(200).json({ error: false, message: 'Post Updated Successfully' });
  } catch (err) {
    console.log('Internal server error: ' + err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

const getUserFeed = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const acceptedInvitations = await Invitation.find({
      $or: [
        { sender: { _id: userId }, status: 'accepted' },
        { receiver: { _id: userId }, status: 'accepted' },
      ],
    }).select('sender receiver -_id');
    const friendIds = acceptedInvitations.map(invitation =>
      invitation.sender.toString() === userId.toString() ? invitation.receiver : invitation.sender
    );

    const posts = await Post.find({
      $or: [
        { user: { _id: userId } },
        { user: { $in: friendIds }, visibility: { $in: ['friends', 'public'] } }, // Friends' posts
        { visibility: 'public' },
      ],
    })
      .populate({
        path: 'user',
        select: 'userName _id',
        populate: {
          path: 'profile',
          select: 'picture email',
        },
      })
      .populate({
        path: 'comments',
        select: 'createdAt content',
        populate: {
          path: 'user',
          select: '_id userName',
          populate: {
            path: 'profile',
            select: 'picture',
          },
        },
      })
      .populate({
        path: 'reactions',
        select: 'type ',
        populate: {
          path: 'user',
          select: '_id userName',
          populate: {
            path: 'profile',
            select: 'picture',
          },
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean();
    const totalPosts = await Post.countDocuments({
      $or: [
        { user: userId },
        { user: { $in: friendIds }, visibility: { $in: ['friends', 'public'] } },
        { visibility: 'public' },
      ],
    });

    const response = {
      error: false,
      message: 'User feed fetched successfully',
      payload: {
        data: posts,
        pagination: {
          total: totalPosts,
          page,
          pages: Math.ceil(totalPosts / pageSize),
        },
      },
    };

    res.status(200).json(response);
  } catch (err) {
    console.log('Internal server error:', err);
    res.status(500).json({ error: true, message: 'Error getting user feed' });
  }
};
export default {
  createPost,
  getMyPosts,
  getPostById,
  updatePost,
  getUserFeed,
};
