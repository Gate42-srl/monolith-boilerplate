import { GetUserById } from "../controllers/userController"
import { User, UserPayload } from "../types"
import { encrypter } from "../utils"

// Middleware that authorize the user
export default async (req: any, res: any) => {
  const { authorization } = req.headers

  if (!authorization) return res.code(401).send("Missing Token")

  try {
    // Verify the JWT
    const decoded = (await encrypter.decodeToken("access", authorization)) as UserPayload

    // Check if the payload exists
    if (!decoded) return res.code(401).send("Invalid token")

    // Check if the user exists
    const user = await getLoggedUser(decoded)
    if (!user) return res.code(403).send("Authentication failed")

    // Add the user to the req
    req.user = decoded
  } catch (error: any) {
    // If the JWT is not valid, return an error
    if (error.name === "JsonWebTokenError") return res.code(403).send("Invalid token")

    // Probably another unknown kind of error, log it and return a different error
    console.error(error.name)
    return res.code(401).send("Unable to parse token")
  }
}

/**
 * @function getLoggedUser
 * @description Utility function retrieve the user from a jwt token
 * @param {string | object} jwtPayload The payload from which you want to retrieve the user
 * @return The logged user
 */
const getLoggedUser = async (jwtPayload: UserPayload) => {
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
