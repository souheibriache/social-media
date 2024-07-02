import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending',
  },
});

export const Invitation = mongoose.model('Invitation', invitationSchema);
