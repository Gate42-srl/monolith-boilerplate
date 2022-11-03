import mongoose from "mongoose"
import { PropertyValidator } from "./propertyValidator"

/**
 * @function userControllerFactory
 * @description Retrieve a PropertyValidator based on request
 * @param {*} request The HttpRequest
 * @returns {PropertyValidator} A property validator
 */
export const userControllerFactory = (request: any) => {
  const { userId, id } = request.params

  if (userId || id) return new UserIdValidator(request, userId || id)
}

class UserIdValidator extends PropertyValidator {
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
