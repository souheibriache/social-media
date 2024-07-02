import { Invitation } from '@models/invitation';
import User from '@models/users.schema';
import { Request, Response } from 'express';

const sendInvitation = async (req: Request, res: Response) => {
  try {
    const receiverId = req.params.userId;
    const receiver = await User.findOne({ _id: receiverId });
    if (!receiver) res.status(404).json({ error: true, message: 'User Not Found!' });
    const existingInvitation = await Invitation.findOne({
      sender: req.user._id,
      receiver: receiverId,
      $or: [{ status: 'pending' }, { status: 'accepted' }],
    });
    if (existingInvitation) return res.status(401).json({ error: true, message: 'Invitation Already Sent!' });
    await new Invitation({ sender: req.user._id, receiver: receiverId }).save();
    res.status(200).json({ error: false, message: 'Invitation Sent Successfully!' });
  } catch (err) {
    console.log('Internal Server Error: ' + err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const cancelInvitation = async (req: Request, res: Response) => {
  try {
    const invitationId = req.params.invitationId;
    const invitation = await Invitation.findOne({
      id: invitationId,
      sender: req.user._id,
      $or: [{ status: 'pending' }, { status: 'accepted' }],
    });
    if (!invitation) return res.status(404).json({ error: true, message: 'Invitation Not Found!' });
    await Invitation.findOneAndUpdate({ _id: invitationId }, { status: 'cancelled' });
    res.status(200).json({ error: false, message: 'Invitation Cancelled Successfully!' });
  } catch (err) {
    console.log('Internal Server Error: ' + err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const unfriendUser = async (req: Request, res: Response) => {
  try {
    const receiverId = req.params.userId;
    const receiver = await User.findOne({ _id: receiverId });
    if (!receiver) res.status(404).json({ error: true, message: 'User Not Found!' });

    const invitation = await Invitation.findOne({ sender: req.user._id, receiver: receiverId, status: 'accepted' });
    if (!invitation) return res.status(404).json({ error: true, message: 'Invitation Not Found!' });
    await Invitation.findOneAndUpdate({ _id: invitation._id }, { status: 'cancelled' });
    return res.status(200).json({ error: false, message: 'User Unfriended Successfully!' });
  } catch (err) {
    console.log('Internal Server Error: ' + err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
};
const acceptInvitation = async (req: Request, res: Response) => {
  try {
    const invitationId = req.params.invitationId;
    const invitation = await Invitation.findOne({ _id: invitationId, status: 'pending', receiver: req.user._id });
    if (!invitation) return res.status(404).json({ error: true, message: 'Invitation Not Found!' });
    await Invitation.findOneAndUpdate({ _id: invitation._id }, { status: 'accepted' });
    return res.status(200).json({ error: false, message: 'Invitation Accepted Successfully!' });
  } catch (err) {
    console.log('Internal Server Error: ' + err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const rejectInvitation = async (req: Request, res: Response) => {
  try {
    const invitationId = req.params.invitationId;
    const invitation = await Invitation.findOne({ _id: invitationId, status: 'pending', receiver: req.user._id });
    if (!invitation) return res.status(404).json({ error: true, message: 'Invitation Not Found!' });
    await Invitation.findOneAndUpdate({ _id: invitation._id }, { status: 'rejected' });
    return res.status(200).json({ error: false, message: 'Invitation Rejected Successfully!' });
  } catch (err) {
    console.log('Internal Server Error: ' + err);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

const getSentInvitations = async (req: Request, res: Response) => {
  const invitaitonsData = await getInvitation(req.user._id, 'sent');
  return res.status(invitaitonsData.statusCode).json({ ...invitaitonsData.payload });
};

const getReceivedInvitations = async (req: Request, res: Response) => {
  const invitaitonsData = await getInvitation(req.user._id, 'received');
  return res.status(invitaitonsData.statusCode).json({ ...invitaitonsData.payload });
};

const getInvitation = async (userId: string, invitationType: 'sent' | 'received') => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user)
      return {
        statusCode: 404,
        payload: {
          message: 'User Not Found!',
          error: true,
        },
      };
    let invitations =
      invitationType === 'sent'
        ? await Invitation.find({ type: invitationType, sender: userId })
        : Invitation.find({ type: invitationType, receiver: userId });
    return {
      statusCode: 200,
      payload: {
        error: false,
        message: 'Get Invitations Successfully!',
        payload: { invitations },
      },
    };
  } catch (err) {
    console.log('Internal Server Error: ' + err);
    return {
      statusCode: 500,
      payload: {
        error: true,
        message: 'Internal server Error',
      },
    };
  }
};
export default {
  sendInvitation,
  acceptInvitation,
  rejectInvitation,
  cancelInvitation,
  unfriendUser,
  getSentInvitations,
  getReceivedInvitations,
};
