import { Chat, IChat } from '@models/chat';
import User from '@models/users.schema';
import { Request, Response } from 'express';

export const create = async (req: Request, res: Response) => {
  try {
    const { recipientId } = req.body;

    const recipient = await User.findOne({ _id: recipientId, status: 'activated' });
    if (!recipient) return res.status(404).json({ error: true, message: 'User not found' });

    const chat = new Chat({ participants: [recipientId, req.user._id] });
    await chat.save();

    return res.status(200).json({ error: false, message: 'Chat created successfully!', payload: chat });
  } catch (error) {
    console.log('Internal server error', error);
    res.status(500).json({
      error: true,
      message: 'Error creating chat',
    });
  }
};

export const getMyChats = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ participants: { $in: [userId] } })
      .populate({
        path: 'participants',
        select: 'userName profile',
        populate: {
          path: 'profile',
          select: 'dateOfBirth gender picture',
        },
      })
      .populate({
        path: 'messages',
        options: { sort: { timestamp: -1 }, limit: 1 },
      })
      .sort({ 'messages.timestamp': -1 })
      .exec();

    return res.status(200).json({
      error: false,
      data: chats,
    });
  } catch (error) {
    console.log('Internal server error :', error);
    return res.status(500).json({
      error: true,
      message: 'Error getting chats',
    });
  }
};

export const getChatById = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.chatId;

    const chat = await Chat.findById(chatId)
      .populate({
        path: 'participants',
        select: 'userName profile',
        populate: {
          path: 'profile',
          select: 'dateOfBirth gender picture',
        },
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          select: 'userName profile',
          populate: {
            path: 'profile',
            select: 'dateOfBirth gender picture',
          },
        },
      })
      .exec();

    if (!chat) {
      return res.status(404).json({
        error: true,
        message: 'Chat not found',
      });
    }

    return res.status(200).json({
      error: false,
      data: chat,
    });
  } catch (error) {
    console.log('Internal server error :', error);
    return res.status(500).json({
      error: true,
      message: 'Error getting chat',
    });
  }
};

export const getChatByRecipientId = async (req: Request, res: Response) => {
  try {
    const recipientId = req.params.recipientId;

    // Find the recipient and populate the profile
    const recipient = await User.findOne({ _id: recipientId }).populate('profile');
    if (!recipient) {
      return res.status(404).json({ error: true, message: 'User not found!' });
    }

    // Find an existing chat with both participants (order doesn't matter)
    let chat = await Chat.findOne({
      participants: { $all: [recipient._id, req.user._id] },
    })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          select: 'userName profile',
          populate: {
            path: 'profile',
            select: 'dateOfBirth gender picture', // Populate the profile fields you need
          },
        },
      })
      .lean();

    // If no existing chat, create a new one
    if (!chat) {
      chat = new Chat({ participants: [recipient._id, req.user._id] });
      await chat.save();
    }

    return res.status(200).json({
      error: false,
      message: 'Chat opened successfully',
      data: { ...chat, recipient },
    });
  } catch (error) {
    console.error('Internal server error :', error);
    return res.status(500).json({
      error: true,
      message: 'Error getting chat',
    });
  }
};

export default {
  getMyChats,
  create,
  getChatByRecipientId,
  getChatById,
};
