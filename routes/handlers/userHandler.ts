import { User } from "../../types"
import { userHandlerFactory } from "../../validation"

import {
  CreateUser,
  DeleteUser,
  GetAllUsers,
  GetUserByEmail,
  GetUserById,
  UpdateUser,
} from "../../controllers/userController"

// This handler is responsable for operations on users
export function userHandler(fastify: any, opts: any, done: any) {
  fastify.decorate("authorize", async (request: any, res: any) => {
    const loggedUser = request.user

    if (loggedUser.role.toLowerCase() == "admin") return

    const validator = userHandlerFactory(request)

    if (!validator || !(await validator.isAuthorized())) return res.status(401).send({ error: "Not authorized" })
  })

  fastify.decorate("fieldNotToUpdate", async (request: any, res: any) => {
    const loggedUser = request.user

    // If user role is admin, its authorized
    if (loggedUser.role.toLowerCase() === "admin") return

    const fieldNotToUpdate = ["password", "role"]

    fieldNotToUpdate.forEach((el) => {
      delete request.body[el]
    })
  })

  fastify.get(
    "/",
    {
      preValidation: [fastify.authorize],
    },
    async (req: any, res: any) => {
      // Calls database function to retrieve the user from its id
      const users = (await GetAllUsers()) as User[]

      // Checks if the user was found
      if (users.length <= 0) res.status(404).send("No user into the database")

      return res.status(200).send(users)
    }
  )

  fastify.get(
    "/:id",
    {
      preValidation: [fastify.authorize],
    },
    async (req: any, res: any) => {
      const id = req.params.id

      // Calls database function to retrieve the user from its id
      const user = await GetUserById(id)

      // Checks if the user was found
      if (!user) res.status(404).send("User not found")

      return res.status(200).send(user)
    }
  )

  fastify.post(
    "/",
    {
      preValidation: [fastify.authorize],
    },
    async (req: any, res: any) => {
      const { email } = req.body as User

      // Calls database function to check if a user with given email already exists
      if (await GetUserByEmail(email)) return res.code(400).send("Email already used")

      // Calls database function that creates the user and saves it into the database
      const savedUser = await CreateUser(req.body)

      // Checks if the user was created
      if (!savedUser) return res.status(500).send("Error during user creation")

      return res.status(200).send(savedUser)
    }
  )

  fastify.put(
    "/:id",
    {
      preValidation: [fastify.authorize, fastify.fieldNotToUpdate],
    },
    async (req: any, res: any) => {
      const { email } = req.body as User

      // Calls database function to check if a user with given email already exists
      if (email && (await GetUserByEmail(email))) return res.code(400).send("Email already used")

      // Calls database function that updates specified user
      const updatedUser = await UpdateUser(req.body, req.params.id)

      if (!updatedUser) return res.code(404).send("User not found")

      return res.status(200).send(updatedUser)
    }
  )

  fastify.patch(
    "/:id",
    {
      preValidation: [fastify.authorize, fastify.fieldNotToUpdate],
    },
    async (req: any, res: any) => {
      const { email } = req.body as User

      // Calls database function to check if a user with given email already exists
      if (email && (await GetUserByEmail(email))) return res.code(400).send("Email already used")

      // Calls database function that updates specified user
      const updatedUser = await UpdateUser(req.body, req.params.id)

      if (!updatedUser) return res.code(404).send("User not found")

      return res.status(200).send(updatedUser)
    }
  )

  fastify.delete(
    "/:id",
    {
      preValidation: [fastify.authorize, fastify.fieldNotToUpdate],
    },
    async (req: any, res: any) => {
      const id = req.params.id

      // Calls database function that removes specified user
      const deletedUser = await DeleteUser(id)

      if (!deletedUser) return res.code(404).send("User not found")

      return res.status(200).send(deletedUser)
    }
  )

  done()
}
