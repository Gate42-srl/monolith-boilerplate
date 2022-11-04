import mongoose from "mongoose"

export interface refreshToken {
  token: string
  userId?: mongoose.Types.ObjectId
}
