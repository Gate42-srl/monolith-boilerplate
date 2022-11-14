import { refreshToken } from "../../types"

import { validateBody } from "../../middlewares/requestValidator"
import { validateAddUserSchema, validateLoginSchema } from "../../validation"

import {
  CreateRefreshToken,
  DeleteRefreshTokenFromToken,
  GetRefreshTokenFromToken,
  GetRefreshTokenFromUserId,
} from "../../controllers/authController"
import { CreateUser, GetUserByEmail, GetUserById, UpdateUser } from "../../controllers/userController"

import { encrypter } from "../../utils"

// This handler is responsable for operations about authentication of users
export function authHandler(fastify: any, opts: any, done: any) {
  fastify.decorate("validateSignUpBody", async (request: any, res: any) => {
    validateBody(validateAddUserSchema)(request, res)
  })

  fastify.decorate("validateLoginBody", async (request: any, res: any) => {
    validateBody(validateLoginSchema)(request, res)
  })

  fastify.post(
    "/signup",
    {
      preValidation: [fastify.validateSignUpBody],
    },
    async (req: any, res: any) => {
      const { email } = req.body

      // Calls database function to verify if a user with given email already exists
      if (await GetUserByEmail(email)) return res.code(400).send("Email already used")

      // If no role is passed, we just set user role by default
      if (!req.body.role) req.body.role = "user"

      // Calls database function to create and save the user
      const savedUser = await CreateUser(req.body)

      // Checks if the user was created
      if (!savedUser) return res.status(500).send("Error during user creation")

      return res.status(200).send(savedUser)
    }
  )

  fastify.post(
    "/login",
    {
      preValidation: [fastify.validateLoginBody],
    },
    async (req: any, res: any) => {
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
      let refreshToken: string | null = ((await GetRefreshTokenFromUserId(user._id)) as refreshToken)?.token

      // If refresh token doesn't exist, generate it and save it on database
      if (!refreshToken) {
        refreshToken = (await encrypter.generateJwt("refresh", claims)) as string
        if (!refreshToken) res.code(500).send("Error during refresh token creation")

        // Calls database function to store the refresh token into the database
        await CreateRefreshToken({ token: refreshToken, userId: user._id })
      }

      return res.status(200).send({ token, refreshToken })
    }
  )

  fastify.post(
    "/token",
    {
      preValidation: [fastify.authenticate],
    },
    async (req: any, res: any) => {
      const refreshToken = req.headers.refresh

      // Checks if the refresh token is present
      if (!refreshToken) res.code(401).send("Token not found")

      // Calls database function to retrieve refresh token and check if it exists into the database, so it is valid
      if (!(await GetRefreshTokenFromToken(refreshToken))) res.code(403).send("Invalid refresh token")

      const { email } = await encrypter.decodeToken("refresh", refreshToken)

      // Calls database function to retrieve the user by its email
      const user = (await GetUserByEmail(email)) as any
      if (!user) return res.code(404).send("Email not found")

      const claims = { _id: user._id, email: user.email, role: user.role }

      // Genereates new access and refresh tokens
      const newToken = await encrypter.generateJwt("access", claims)
      if (!newToken) res.code(500).send("Error during token creation")

      const newRefreshToken = (await encrypter.generateJwt("refresh", claims)) as string
      if (!refreshToken) res.code(500).send("Error during refresh token creation")

      // Calls database function to delete previous refresh token
      const tokenToDelete = await DeleteRefreshTokenFromToken(refreshToken)
      if (!tokenToDelete) return res.status(500).send("Previous token not deleted")

      // Calls database function to store the refresh token into the database
      await CreateRefreshToken({ token: newRefreshToken, userId: user._id })

      return res.status(200).send({ newToken, newRefreshToken })
    }
  )

  fastify.get(
    "/user",
    {
      preValidation: [fastify.authenticate],
    },
    async (req: any, res: any) => {
      // Calls database function to retrieve the user from its id
      const user = await GetUserById(req.user._id)

      // Checks if the user was found
      if (!user) res.status(404).send("User not found")

      return res.status(200).send(user)
    }
  )

  done()
}
