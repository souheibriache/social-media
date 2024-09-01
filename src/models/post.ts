import mongoose, { InferSchemaType } from 'mongoose';

const commentsSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
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
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
});

const reactionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  type: {
    type: String,
    enum: ['like', 'love', 'haha', 'angry', 'unlike'],
    default: 'like',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
});

const postSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
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
    enum: ['only_me', 'friends', 'public'],
    default: 'friends',
  },

  reactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reaction',
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  images: [
    {
      type: String,
    },
  ],
});

export type PostType = InferSchemaType<typeof postSchema>;
export type CommentType = InferSchemaType<typeof commentsSchema>;
// export type ReactionType = InferSchemaType<typeof reactionSchema>;

export const Post = mongoose.model('Post', postSchema);
export const Reaction = mongoose.model('Reaction', reactionSchema);
export const Comment = mongoose.model('Comment', commentsSchema);
