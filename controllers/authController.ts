import { token } from "morgan"
import { refreshTokenModel, UserModel } from "../models"
import { User } from "../types"
import { encrypter } from "../utils"

//regex for password validation
const VALID_PASSWORD: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/

// This controller is used to handler operations on users
export function authController(fastify: any, opts: any, done: any) {
  fastify.post("/signup", async (req: any, res: any) => {
    const { email } = req.body

    //if an user inserts a password who does not respect the pattern (one upper case, one special char, min. length 8) rejects the request
    if (!VALID_PASSWORD.test(req.body.password))
      return res.code(400).send("Password should have one upper case, one special character and a minimum length of 8")

    // Verifies if a user with given email already exists
    if (await UserModel.findOne({ email })) return res.code(400).send("Email already used")

    // Creates and saves the user
    const savedUser: User = await new UserModel(req.body).save()

    return res.status(200).send(savedUser)
  })

  fastify.post("/login", async (req: any, res: any) => {
    const { email, password } = req.body

    // Verifies if the user with given email exists
    const user = await UserModel.findOne({ email })
    if (!user) return res.code(404).send("Email not found")

    // Verifies if the given password matches with the one storted into the db
    const passwordMatched = await encrypter.comparePassword(password, user.password)

    if (!passwordMatched) return res.code(401).send("Wrong password")

    // Updates last lagin fields
    const updateLastLogin = await UserModel.findByIdAndUpdate(user._id, { lastLogin: new Date() })

    if (!updateLastLogin) return res.code(500).send("Error updating user")

    const claims = { _id: user._id, email: user.email, role: user.role }

    // Genereates access token
    const token = await encrypter.generateJwt("access", claims)
    if (!token) res.code(500).send("Error during token creation")

    // Retrieves refresh token for the user if it already exists
    let refreshToken = (await refreshTokenModel.findOne({ userId: user._id }))?.token

    // If refresh token doesn't exist, generate it and save it on database
    if (!refreshToken) {
      refreshToken = (await encrypter.generateJwt("refresh", claims)) as string
      if (!refreshToken) res.code(500).send("Error during refresh token creation")

      // Stores the refresh token into the database
      await new refreshTokenModel({ token: refreshToken, userId: user._id }).save()
    }

    return res.status(200).send({ token, refreshToken })
  })

  fastify.post("/token", async (req: any, res: any) => {
    const refreshToken = req.headers("x-auth-token")

    // Checks if the refresh token is present
    if (!refreshToken) res.code(401).send("Token not found")

    // Checks if the refresh token exists into the database, so it is valid
    if (!(await refreshTokenModel.findOne({ token: refreshToken }))) res.code(403).send("Invalid refresh token")

    const { email } = await encrypter.decodeRefreshToken(refreshToken)

    // Retrieves the user via its email
    const user = await UserModel.findOne({ email })
    if (!user) return res.code(404).send("Email not found")

    const claims = { _id: user._id, email: user.email, role: user.role }

    // Genereates new access and refresh tokens
    const newToken = await encrypter.generateJwt("access", claims)
    if (!token) res.code(500).send("Error during token creation")

    const newRefreshToken = await encrypter.generateJwt("refresh", claims)
    if (!refreshToken) res.code(500).send("Error during refresh token creation")

    // Delete previous refresh token
    const tokenToDelete = await refreshTokenModel.findOneAndDelete({ token: refreshToken })
    if (!tokenToDelete) return res.status(500).send("Previous token not deleted")

    // Stores the refrsh token into the database
    await new refreshTokenModel({ token: newRefreshToken, userId: user._id }).save()

    return res.status(200).send({ newToken, newRefreshToken })
  })

  done()
}
