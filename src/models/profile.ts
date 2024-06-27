import { required } from "joi";
import mongoose, { InferSchemaType } from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    default: "Male",
  },
});

const Profile = mongoose.model("Profile", profileSchema);
export type ProfileType = InferSchemaType<typeof profileSchema>;
export default Profile;
