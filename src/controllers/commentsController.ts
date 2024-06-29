import { Comment, Post, PostType } from '@models/post';
import { Request, Response } from 'express';

const postComment = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const post: PostType = await Post.findOne({ _id: postId, user: req.user._id });
    if (!post) return res.status(404).json({ error: true, message: 'Post Not Found!' });
    console.log({ post });
    const comment = await new Comment({ ...req.body, post: postId, user: req.user._id }).save();

    return res.status(200).json({ error: false, message: 'Comment created successfully', payload: { comment } });
  } catch (err) {
    console.log('Internal server error: ' + err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

const getPostComments = async (req: Request, res: Response) => {
  try {
    const sortOption = (req.query.sortOption as string) || 'createdAt';
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const postId = req.params.postId;
    const comments = await Comment.find({ post: postId })
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();
    const unfilteredComments = await Comment.find({ post: postId });
    console.log({ comments, unfilteredComments });
    const total = await Comment.countDocuments({ post: postId });
    const response = {
      error: false,
      message: 'Get post comments successfully',
      payload: {
        data: comments,
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

const getCommentById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findOne({ _id: postId, user: req.user._id });
    if (!post) return res.status(404).json({ error: true, message: 'Post Not Found!' });
    const commentId = req.params.commentId;
    const comment = await Comment.findOne({ _id: commentId });
    return res.status(200).json({ error: false, message: 'Get comment successfully', payload: { comment } });
  } catch (err) {
    console.log('Internal server error: ' + err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId, postId } = req.params;
    const post = await Post.findOne({ _id: postId, user: req.user._id });
    if (!post) return res.status(404).json({ error: true, message: 'Post Not Found!' });
    const commentDeleteResult = await Comment.deleteOne({ _id: commentId, post: postId, user: req.user._id });
    if (commentDeleteResult.deletedCount < 1)
      return res.status(404).json({ error: true, message: 'Comment Not Found!' });
    return res.status(200).json({ error: false, message: 'comment deleted successfully' });
  } catch (err) {
    console.log('Internal server error: ' + err);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

export default {
  deleteComment,
  getPostComments,
  getCommentById,
  postComment,
};
