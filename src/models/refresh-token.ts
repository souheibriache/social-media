import mongoose, { InferSchemaType } from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now(), expires: 30 * 86400 }, //? 30 Days
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
export type RefreshTokenType = InferSchemaType<typeof refreshTokenSchema>;
export default RefreshToken;
