// TYPES
import { DoneFuncWithErrOrRes } from "fastify"
import { User, UserPayload } from "../../types"

// MODELS
import { UserModel, refreshTokenModel } from "../../models"

// VALIDATION
import { isValidObjectId } from "mongoose"
import {
  validateBody,
  userHandlerFactory,
  validateAddUserSchema,
  validateUpdateUserSchema,
  validatePatchUserSchema,
  validateAdminFilterSchema,
  validateChangePasswordSchema
} from "../../validation"

// CONTROLLERS
import {
  CreateUser,
  DeleteUser,
  GetAllUsers,
  GetUserByEmail,
  GetUserById,
  UpdateUser,
} from "../../controllers/userController"

// UTILS
import { encrypter, isExpired } from "../../utils"

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

  fastify.decorate("validateAdminFilterBody", async (request: any, res: any) => {
    validateBody(validateAdminFilterSchema)(request, res)
  })

  fastify.decorate("validateChangePasswordBody", async (request: any, res: any) => {
    validateBody(validateChangePasswordSchema)(request, res)
  })

  fastify.decorate("parseJSON", async (request: any, res: any) => {
    request.body = JSON.parse(request.body)
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

  fastify.put(
    "/blockUnblock/:id",
    {
      preValidation: [fastify.authenticate, fastify.authorize, fastify.idValidatorParams],
    },
    blockUnblockHandler
  )

  fastify.post(
    "/adminFilter",
    {
      preValidation: [fastify.authenticate, fastify.authorize, fastify.parseJSON, fastify.validateAdminFilterBody],
    },
    adminFilterHandler
  )

  fastify.patch(
    "/changePassword",
    {
      preValidation: [fastify.parseJSON, fastify.validateChangePasswordBody],
    },
    changePasswordHandler
  )

  done()
}

// Retrieve all users API
export const allUsersHandler = async (req: any, res: any) => {
  // Calls database function to retrieve the user from its id
  const users = (await GetAllUsers()) as User[]

  // Checks if the user was found
  if (users.length <= 0) res.status(404).send("No user into the database")

  return res.code(200).send(users)
}

// Retrieve single user by its id API
export const userByIdHandler = async (req: any, res: any) => {
  const id = req.params.id

  // Calls database function to retrieve the user from its id
  const user = await GetUserById(id)

  // Checks if the user was found
  if (!user) res.code(404).send("User not found")

  return res.code(200).send(user)
}

// Create user API
export const createUserHandler = async (req: any, res: any) => {
  const { email } = req.body as User

  // Calls database function to check if a user with given email already exists
  if (await GetUserByEmail(email)) return res.code(400).send("Email already used")

  // Calls database function that creates the user and saves it into the database
  const savedUser = await CreateUser(req.body)

  // Checks if the user was created
  if (!savedUser) return res.code(500).send("Error during user creation")

  return res.code(200).send(savedUser)
}

// Update user API
export const updateUserHandler = async (req: any, res: any) => {
  const { email } = req.body as User

  // Calls database function to check if a user with given email already exists
  if (email && (await GetUserByEmail(email))) return res.code(400).send("Email already used")

  // Calls database function that updates specified user
  const updatedUser = await UpdateUser(req.body, req.params.id)

  if (!updatedUser) return res.code(404).send("User not found")

  return res.code(200).send(updatedUser)
}

// Delete user API
export const deleteUserHandler = async (req: any, res: any) => {
  const id = req.params.id

  // Calls database function that removes specified user
  const deletedUser = await DeleteUser(id)

  if (!deletedUser) return res.code(404).send("User not found")

  return res.code(200).send(deletedUser)
}

// Block/Unblock user API
export const blockUnblockHandler = async (req: any, res: any) => {
  const userId = req.params.id

  // Retrieves a user by given id
  let user = (await GetUserById(userId)) as User
  if (!user) return res.status(404).send("User not found")

  // If the user is active: block it. If the user is blocked: unblock it.
  if (user.status === "active") user = (await UpdateUser({ status: "blocked" }, userId)) as User
  else user = (await UpdateUser({ status: "active" }, userId)) as User

  // If the user is blocked removes token from DB
  if (user.status === "blocked") await refreshTokenModel.deleteMany({ userId })

  return res.status(200).send(user)
}

// Filters on users for Admin page API
export const adminFilterHandler = async (req: any, res: any) => {
  const Obj = {} as any
  const filterFields = req.body

  Object.keys(filterFields).forEach((key) => {
    Obj[key] = { ...Obj[key], ...{ $in: filterFields[key].trim() } }
  })

  const filterUsers = await UserModel.find(Obj).sort({ firstname: 1 })

  return res.status(200).send(filterUsers)
}

// Change password API
export const changePasswordHandler = async (req: any, res: any) => {
  // Decodes token and verifies expiration
  const decodedToken = (await isExpired("passwordReset", req.headers.authorization)) as Partial<UserPayload> | string

  // Verifies if token is invalid or expired
  if (!decodedToken) return res.status(401).send("ResetPassword token not valid")
  if (decodedToken === "expired") return res.status(401).send("ResetPassword token expired")

  // Updates user with the new password
  await UpdateUser(
    { password: await encrypter.hashPassword(req.body.password) },
    (decodedToken as Partial<UserPayload>)._id as string
  )

  res.status(200).send("Password changed")
}
