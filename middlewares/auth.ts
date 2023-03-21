import { DeleteRefreshTokenFromToken, GetRefreshTokenFromToken } from "../controllers/authController"
import { UserPayload } from "../types"
import { getLoggedUser, isExpired } from "../utils"

// Middleware that authorize the user
export default async (req: any, res: any) => {
  const { authorization, refresh } = req.headers

  if (!authorization || !refresh) return res.code(401).send("Missing Token")

  try {
    // Verify the refresh JWT
    const refreshDecoded = (await isExpired("refresh", refresh)) as UserPayload | string

    // Verify the regular JWT
    const decoded = (await isExpired("access", authorization)) as UserPayload | string

    // Check if the payload exists
    if (!decoded && !refreshDecoded) return res.code(401).send("Invalid token")

    // Checks if one of the two tokens is expired
    if (refreshDecoded == "expired") {
      // Calls DB function to delete refresh token
      await DeleteRefreshTokenFromToken(refresh)

      return res.code(403).send("Refresh Token Expired")
    }
    if (decoded == "expired") return res.status(401).send("Token Expired")

    // Verifies if exists given refresh token into database
    if (!GetRefreshTokenFromToken(refresh)) return res.status(403).send("Authentication failed")

    // Check if the user exists
    const user = await getLoggedUser(decoded as UserPayload)
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
