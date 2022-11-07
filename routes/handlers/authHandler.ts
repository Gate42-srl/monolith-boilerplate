import { refreshToken } from "../../types"

import {
  CreateRefreshToken,
  DeleteRefreshTokenFromToken,
  GetRefreshTokenFromToken,
  GetRefreshTokenFromUserId,
} from "../../controllers/authController"
import { CreateUser, GetUserByEmail, UpdateUser } from "../../controllers/userController"

import { encrypter } from "../../utils"

//regex for password validation
const VALID_PASSWORD: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/

// This handler is responsable for operations about authentication of users
export function authHandler(fastify: any, opts: any, done: any) {
  fastify.post("/signup", async (req: any, res: any) => {
    const { email } = req.body

    // if an user inserts a password who does not respect the pattern (one upper case, one special char, min. length 8) rejects the request
    if (!VALID_PASSWORD.test(req.body.password))
      return res.code(400).send("Password should have one upper case, one special character and a minimum length of 8")

    // Calls database function to verify if a user with given email already exists
    if (await GetUserByEmail(email)) return res.code(400).send("Email already used")

    // Calls database function to create and save the user
    const savedUser = await CreateUser(req.body)

    // Checks if the user was created
    if (!savedUser) return res.status(500).send("Error during user creation")

    return res.status(200).send(savedUser)
  })

  fastify.post("/login", async (req: any, res: any) => {
    const { email, password } = req.body

    // Calls database function to verify if a user with given email already exists
    const user = (await GetUserByEmail(email)) as any
    if (!user) return res.code(404).send("Email not found")

    // Verifies if the given password matches with the one storted into the db
    const passwordMatched = await encrypter.comparePassword(password, user.password)

    if (!passwordMatched) return res.code(401).send("Wrong password")

    // Calls database function to update last lagin field for user
    const updateLastLogin = await UpdateUser({ lastLogin: new Date() }, user._id)

    if (!updateLastLogin) return res.code(500).send("Error updating user")

    const claims = { _id: user._id, email: user.email, role: user.role }

    // Genereates access token
    const token = await encrypter.generateJwt("access", claims)
    if (!token) res.code(500).send("Error during token creation")

    // Calls database function to retrieve refresh token for the user if it already exists
    let refreshToken = ((await GetRefreshTokenFromUserId(user._id)) as refreshToken).token

    // If refresh token doesn't exist, generate it and save it on database
    if (!refreshToken) {
      refreshToken = (await encrypter.generateJwt("refresh", claims)) as string
      if (!refreshToken) res.code(500).send("Error during refresh token creation")

      // Calls database function to store the refresh token into the database
      await CreateRefreshToken({ token: refreshToken, userId: user._id })
    }

    return res.status(200).send({ token, refreshToken })
  })

  fastify.post("/token", async (req: any, res: any) => {
    const refreshToken = req.headers("x-auth-token")

    // Checks if the refresh token is present
    if (!refreshToken) res.code(401).send("Token not found")

    // Calls database function to retrieve refresh token and check if it exists into the database, so it is valid
    if (!(await GetRefreshTokenFromToken(refreshToken))) res.code(403).send("Invalid refresh token")

    const { email } = await encrypter.decodeRefreshToken(refreshToken)

    // Calls database function to retrieve the user by its email
    const user = (await GetUserByEmail(email)) as any
    if (!user) return res.code(404).send("Email not found")

    const claims = { _id: user._id, email: user.email, role: user.role }

    // Genereates new access and refresh tokens
    const newToken = await encrypter.generateJwt("access", claims)
    if (!newToken) res.code(500).send("Error during token creation")

    const newRefreshToken = await encrypter.generateJwt("refresh", claims)
    if (!refreshToken) res.code(500).send("Error during refresh token creation")

    // Calls database function to delete previous refresh token
    const tokenToDelete = await DeleteRefreshTokenFromToken(refreshToken)
    if (!tokenToDelete) return res.status(500).send("Previous token not deleted")

    // Calls database function to store the refresh token into the database
    await CreateRefreshToken({ token: refreshToken, userId: user._id })

    return res.status(200).send({ newToken, newRefreshToken })
  })

  done()
}
