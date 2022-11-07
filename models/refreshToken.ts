import mongoose from "mongoose"
import { refreshToken } from "../types/models"

const refreshTokenSchema = new mongoose.Schema<refreshToken>({
  token: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    unique: true,
    required: true,
  },
})

export default mongoose.model<refreshToken>("refreshToken", refreshTokenSchema)
