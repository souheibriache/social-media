import { Comment, Post, PostType, Reaction } from '@models/post';
import { Request, Response } from 'express';

const createPost = async (req: Request, res: Response) => {
  try {
    console.log({ ...req.body });
    const post = await new Post({ ...req.body, user: req.user._id }).save();
    res.status(200).json({ error: false, message: 'Post created successfully', payload: { post } });
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

export default {
  createPost,
  getMyPosts,
  getPostById,
  updatePost,
};
