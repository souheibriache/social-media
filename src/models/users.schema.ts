import mongoose, { InferSchemaType } from 'mongoose';

const usersSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
    default: new mongoose.Types.ObjectId(),
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
});

const User = mongoose.model('Users', usersSchema);

export type UsersType = InferSchemaType<typeof usersSchema>;

export default User;
