import { isValidObjectId } from "mongoose"
import { validateBody } from "../../middlewares/requestValidator"
import {
  userHandlerFactory,
  validateAddUserSchema,
  validateUpdateUserSchema,
  validatePatchUserSchema,
} from "../../validation"

import {
  CreateUser,
  DeleteUser,
  GetAllUsers,
  GetUserByEmail,
  GetUserById,
  UpdateUser,
} from "../../controllers/userController"

import { User } from "../../types"
import { DoneFuncWithErrOrRes } from "fastify"

// This handler is responsable for operations on users
export function userHandler(fastify: any, opts: any, done: DoneFuncWithErrOrRes) {
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

  fastify.decorate("idValidatorParams", async (request: any, res: any) => {
    const id = request.params.id

    // Checking if the id is valid or not.
    if (!isValidObjectId(id)) return res.status(400).send("Invalid Id")
  })

  fastify.decorate("validateAddUserBody", async (request: any, res: any) => {
    validateBody(validateAddUserSchema)(request, res)
  })

  fastify.decorate("validateUpdateUserBody", async (request: any, res: any) => {
    validateBody(validateUpdateUserSchema)(request, res)
  })

  fastify.decorate("validatePatchUserBody", async (request: any, res: any) => {
    validateBody(validatePatchUserSchema)(request, res)
  })

  fastify.get(
    "/",
    {
      preValidation: [fastify.authenticate, fastify.authorize],
    },
    allUsersHandler
  )

  fastify.get(
    "/:id",
    {
      preValidation: [fastify.authenticate, fastify.authorize, fastify.idValidatorParams],
    },
    userByIdHandler
  )

  fastify.post(
    "/",
    {
      preValidation: [fastify.authenticate, fastify.authorize, fastify.validateAddUserBody],
    },
    createUserHandler
  )

  fastify.put(
    "/:id",
    {
      preValidation: [
        fastify.authenticate,
        fastify.authorize,
        fastify.idValidatorParams,
        fastify.validateUpdateUserBody,
        fastify.fieldNotToUpdate,
      ],
    },
    updateUserHandler
  )

  fastify.patch(
    "/:id",
    {
      preValidation: [
        fastify.authenticate,
        fastify.authorize,
        fastify.idValidatorParams,
        fastify.validatePatchUserBody,
        fastify.fieldNotToUpdate,
      ],
    },
    updateUserHandler
  )

  fastify.delete(
    "/:id",
    {
      preValidation: [fastify.authenticate, fastify.authorize, fastify.idValidatorParams],
    },
    deleteUserHandler
  )

  done()
}

export const allUsersHandler = async (req: any, res: any) => {
  // Calls database function to retrieve the user from its id
  const users = (await GetAllUsers()) as User[]

  // Checks if the user was found
  if (users.length <= 0) res.status(404).send("No user into the database")

  return res.status(200).send(users)
}

export const userByIdHandler = async (req: any, res: any) => {
  const id = req.params.id

  // Calls database function to retrieve the user from its id
  const user = await GetUserById(id)

  // Checks if the user was found
  if (!user) res.status(404).send("User not found")

  return res.status(200).send(user)
}

export const createUserHandler = async (req: any, res: any) => {
  const { email } = req.body as User

  // Calls database function to check if a user with given email already exists
  if (await GetUserByEmail(email)) return res.code(400).send("Email already used")

  // Calls database function that creates the user and saves it into the database
  const savedUser = await CreateUser(req.body)

  // Checks if the user was created
  if (!savedUser) return res.status(500).send("Error during user creation")

  return res.status(200).send(savedUser)
}

export const updateUserHandler = async (req: any, res: any) => {
  const { email } = req.body as User

  // Calls database function to check if a user with given email already exists
  if (email && (await GetUserByEmail(email))) return res.code(400).send("Email already used")

  // Calls database function that updates specified user
  const updatedUser = await UpdateUser(req.body, req.params.id)

  if (!updatedUser) return res.code(404).send("User not found")

  return res.status(200).send(updatedUser)
}

export const deleteUserHandler = async (req: any, res: any) => {
  const id = req.params.id

  // Calls database function that removes specified user
  const deletedUser = await DeleteUser(id)

  if (!deletedUser) return res.code(404).send("User not found")

  return res.status(200).send(deletedUser)
}
