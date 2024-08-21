import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  content: string;
  chat: mongoose.Types.ObjectId;
  timestamp: Date;
  seenAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  timestamp: { type: Date, default: Date.now },
  seenAt: { type: Date, required: false, default: null },
});

const Message = mongoose.model<IMessage>('Message', messageSchema);

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
}

const chatSchema = new Schema<IChat>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
});

const Chat = mongoose.model<IChat>('Chat', chatSchema);

export { Message, Chat };
