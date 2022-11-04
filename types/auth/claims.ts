import mongoose from "mongoose"

export interface userClaims {
  _id: mongoose.Types.ObjectId
  email: string
  role: string
}
