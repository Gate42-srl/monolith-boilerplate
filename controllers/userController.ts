import { User } from "../types"
import { userControllerFactory } from "../validation"

import config from "config"
const database: string = config.get("DATABASE")

import { GetById } from "../databases/PostgreSQL"
import { UserModel } from "../models"

// This controller is used to handler operations on users
export function userController(fastify: any, opts: any, done: any) {
  fastify.decorate("authorize", async (request: any, res: any) => {
    const loggedUser = request.user

    if (loggedUser.role.toLowerCase() == "admin") return

    const validator = userControllerFactory(request)

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
    "/:id",
    {
      preValidation: [fastify.authorize],
    },
    async (req: any, res: any) => {
      const id = req.params.id

      if (database.toLocaleLowerCase() === "mongodb") {
        // Mongoose function to retrieve the user by its id
        const user = await UserModel.findById(id)

        return user
      } else if (database.toLocaleLowerCase() === "postgresql") {
        const user = GetById("users", id)

        return user
      }
    }
  )

  fastify.post(
    "/",
    {
      preValidation: [fastify.authorize],
    },
    async (req: any, res: any) => {
      const { email } = req.body as User

      if (await UserModel.findOne({ email })) return res.code(400).send("Email already used")

      // Creates the user
      const newUser = new UserModel(req.body)
      newUser.role = "user"

      // Saves the user
      const savedUser = await newUser.save()

      return savedUser
    }
  )

  fastify.put(
    "/:id",
    {
      preValidation: [fastify.authorize, fastify.fieldNotToUpdate],
    },
    async (req: any, res: any) => {
      const { email } = req.body as User

      if (email && (await UserModel.findOne({ email }))) return res.code(400).send("Email already used")

      // Updates specified user
      const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true })

      if (!updatedUser) return res.code(404).send("Cannot find a user with the specified ID")

      return updatedUser
    }
  )

  fastify.patch(
    "/:id",
    {
      preValidation: [fastify.authorize, fastify.fieldNotToUpdate],
    },
    async (req: any, res: any) => {
      const { email } = req.body as User

      if (email && (await UserModel.findOne({ email }))) return res.code(400).send("Email already used")

      // Updates specified user
      const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true })

      if (!updatedUser) return res.code(404).send("Cannot find a user with the specified ID")

      return updatedUser
    }
  )

  fastify.delete(
    "/:id",
    {
      preValidation: [fastify.authorize, fastify.fieldNotToUpdate],
    },
    async (req: any, res: any) => {
      const id = req.params.id

      // Removes specified user
      const deletedUser = await UserModel.findByIdAndDelete(id)

      if (!deletedUser) return res.code(404).send("Cannot find a user with the specified ID")

      return deletedUser
    }
  )

  done()
}
