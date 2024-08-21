import mongoose, { InferSchemaType } from 'mongoose';

const usersSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    enum: ['user', 'admin', 'super_admin'],
    default: ['user'],
  },
  status: {
    type: String,
    enum: ['active', 'disactivated', 'disabled'],
    default: 'active',
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile', // Reference to the Profile model
  },

  socket: {
    type: String,
    required: false,
    default: null,
  },
});

const User = mongoose.model('User', usersSchema);

export type UsersType = InferSchemaType<typeof usersSchema>;

export default User;
