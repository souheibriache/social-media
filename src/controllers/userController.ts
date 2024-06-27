import Profile from "@models/profile";
import User from "@models/users.schema";
import { Request, Response } from "express";

const get = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) throw new Error();
    const profile = await Profile.findOne({ user: req.user._id });
    console.log({ user, profile });
    if (!profile)
      res.status(400).json({ error: true, message: "Profile not found" });

    delete user.password;

    res.status(200).json({
      error: false,
      payload: {
        userName: user.userName,
        email: user.email,
        userId: user._id,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const userProfile = await Profile.findOne({ user: req.user._id });
    if (!!userProfile)
      return res
        .status(401)
        .json({ error: true, message: "Profile already exists" });

    const profile = await new Profile({
      ...req.body,
      user: req.user._id,
    }).save();
    return res.status(200).json({
      error: false,
      message: "Profile created successfully",
      payload: { ...profile },
    });
  } catch (err) {
    console.log("Internal server error: " + err);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export default { get, create };
