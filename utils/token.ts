import { encrypter } from "."
import { GetUserById } from "../controllers/userController"
import { AuthPayload, User, UserPayload } from "../types"

/**
 * @function isNotExpired
 * @description If the token is expired returns "expired" else returns decoded token
 * @param {AuthPayload} token - AuthPayload - this is the decoded JWT token
 * @returns A decoded token object or a string
 */
//Check if the token has expired
export const isExpired = async (type: string, token: any) => {
  try {
    switch (type) {
      case "access":
        return (await encrypter.decodeToken("access", token)) as AuthPayload
      case "refresh":
        return (await encrypter.decodeToken("refresh", token)) as AuthPayload
      case "passwordReset":
        return (await encrypter.decodeToken("passwordReset", token)) as AuthPayload
      default:
        return null
    }
  } catch (error: any) {
    if (error.name === "TokenExpiredError") return "expired"
  }
}

/**
 * @function getLoggedUser
 * @description Utility function retrieve the user from a jwt token
 * @param {string | object} jwtPayload The payload from which you want to retrieve the user
 * @return The logged user
 */
export const getLoggedUser = async (jwtPayload: UserPayload) => {
  const { _id, role } = jwtPayload

  switch (role) {
    case "admin":
    case "user":
      // Calls database function to retrieve the user by its id
      const user = (await GetUserById(_id)) as User

      if (user.role == role) return user
      else return null
    default:
      return null
  }
}
