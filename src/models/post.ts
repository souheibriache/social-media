import mongoose, { mongo } from 'mongoose';

const commentsSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },

  content: {
    type: String,
    required: true,
  },
});

const reactionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  type: {
    type: String,
    enum: ['like', 'love', 'haha', 'angry', 'sad'],
    default: 'like',
  },
});

const postSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  visibility: {
    type: String,
    enum: ['only_me', 'followers', 'public'],
    default: 'friends',
  },

  reactions: [reactionSchema],
  comments: [commentsSchema],
  images: [
    {
      type: String,
    },
  ],
});

const Post = mongoose.model('Post', postSchema);
const Reaction = mongoose.model('Reaction', reactionSchema);
const Comment = mongoose.model('Comment', commentsSchema);

export default {
  Post,
  Reaction,
  Comment,
};
