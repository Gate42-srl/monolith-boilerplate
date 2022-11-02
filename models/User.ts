import mongoose from "mongoose"
import { User } from "../types/models"
import { encrypter } from "../utils"

const UserSchema = new mongoose.Schema<User>({
  email: {
    type: String,
    unique: true,
    required: [true, "email is required!"],
  },
  password: String,
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  status: {
    type: String,
    enum: [],
  },
  lastLogin: {
    type: Date,
    default: new Date(),
  },
})

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }

  this.password = await encrypter.hashPassword(this.password)
  return next()
})

// Used to avoid to return protected data
UserSchema.methods.toJSON = function () {
  // Parse the user to an object
  const user = this.toObject()

  // Remove all the forbidden fields
  delete user.password

  return user
}

export default mongoose.model<User>("User", UserSchema)
