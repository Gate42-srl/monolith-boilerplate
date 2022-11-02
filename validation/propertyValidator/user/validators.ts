import mongoose from "mongoose"
import { PropertyValidator } from "../propertyValidator"

export class UserIdValidator extends PropertyValidator {
  _userId: mongoose.Types.ObjectId

  constructor(request: any, userId: mongoose.Types.ObjectId) {
    super(request)
    this._userId = userId
  }

  async isAuthorized(): Promise<boolean> {
    const loggedUser = this._request.user

    return this._userId == loggedUser._id
  }
}
