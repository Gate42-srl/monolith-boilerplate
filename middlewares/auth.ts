import { DeleteRefreshTokenFromToken } from "../controllers/authController"
import { UserPayload } from "../types"
import { encrypter, getLoggedUser, isExpired } from "../utils"

// Middleware that authorize the user
export default async (req: any, res: any) => {
  const { authorization, refresh } = req.headers

  if (!authorization || !refresh) return res.code(401).send("Missing Token")

  try {
    // Verify the JWT
    const decoded = (await encrypter.decodeToken("access", authorization)) as UserPayload

    // Check if the payload exists
    if (!decoded) return res.code(401).send("Invalid token")

    // Checks if both access and refresh token are expired
    if ((await isExpired("refresh", refresh)) && (await isExpired("access", authorization))) {
      // Calls database function to delete expired refresh token
      await DeleteRefreshTokenFromToken(refresh)

      // If both are expired return an authorization error
      return res.code(401).send("Token expired")
    }

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
