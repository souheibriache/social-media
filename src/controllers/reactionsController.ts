import { Post, Reaction } from '@models/post';
import { Request, Response } from 'express';

const createReaction = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const post = await Post.findOne({ _id: postId, user: req.user._id });
  if (!post) return res.status(404).json({ error: true, message: 'Post Not Found!' });
  await Reaction.deleteMany({ post: postId, user: req.user._id });
  await Post.findByIdAndUpdate(postId, { $pull: { reactions: { user: req.user._id } } });
  const reaction = await new Reaction({ ...req.body, user: req.user._id, post: post._id }).save();
  await Post.findByIdAndUpdate(postId, { $push: { reactions: reaction._id } });
  res.status(200).json({ error: false, message: 'Reaction posted successfully', payload: { reaction } });
};

const deleteReaction = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const post = await Post.findOne({ _id: postId, user: req.user._id });
  if (!post) return res.status(404).json({ error: true, message: 'Post Not Found!' });
  const deleteReactionResult = await Reaction.deleteOne({ post: postId, user: req.user._id });
  if (deleteReactionResult.deletedCount < 1) return res.status(404).json({ error: true, message: 'No reaction found' });
  await Post.findByIdAndUpdate(postId, { $pull: { reactions: { user: req.user._id } } });
  res.status(200).json({ error: false, message: 'Reaction deleted successfully' });
};

const getPostReactions = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ _id: postId, user: req.user._id });
    if (!post) return res.status(404).json({ error: true, message: 'Post Not Found!' });
    console.log({ postId, post });
    const reactions = await Reaction.find({ post: postId });
    res.status(200).json({ error: false, message: 'Get reactions successfully', payload: { reactions } });
  } catch (err) {
    console.log('Internal server error: ' + err);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

export default {
  getPostReactions,
  createReaction,
  deleteReaction,
};
