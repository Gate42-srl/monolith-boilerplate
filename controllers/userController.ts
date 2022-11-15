import config from "config"
import mongoose from "mongoose"
const database = (config.get("DATABASE") as string).toLowerCase()

import { GetById, GetAll, Create, Update, Delete, pool } from "../databases/PostgreSQL"
import { UserModel } from "../models"

import { User } from "../types"
import { encrypter } from "../utils"

export const GetUserById = async (id: string) => {
  let user: User | null

  switch (database) {
    case "mongodb":
      // Mongoose function to retrieve the user by its id
      user = await UserModel.findById(id)
      break
    case "postgresql":
      // PostgreSQL query
      user = await GetById("users", id)
      break
    default:
      user = null
      break
  }

  return user
}

export const GetAllUsers = async () => {
  let users: User[] | null

  switch (database) {
    case "mongodb":
      // Mongoose function to retrieve all users
      users = await UserModel.find()
      break
    case "postgresql":
      // PostgreSQL query
      users = await GetAll("users")
      break
    default:
      users = []
      break
  }

  return users
}

export const GetUserByEmail = async (email: string) => {
  let user: User | null

  switch (database) {
    case "mongodb":
      // Mongoose function to retrieve the user by email
      user = await UserModel.findOne({ email })
      break
    case "postgresql":
      // PostgreSQL query
      user = (await pool.query(`SELECT * FROM users WHERE email = $1`, [email])).rows[0]
      break
    default:
      user = null
      break
  }

  return user
}

export const CreateUser = async (userToAdd: User) => {
  type UserWithId = Partial<User> & { _id: mongoose.Types.ObjectId }

  let user: UserWithId | null

  switch (database) {
    case "mongodb":
      // Creates the user and saves it with mongoose function
      user = await new UserModel(userToAdd).save()
      break
    case "postgresql":
      // PostgreSQL insert
      const newUser = Object.entries(new UserModel(userToAdd))[1][1]
      newUser.password = await encrypter.hashPassword(newUser.password)
      newUser._id = newUser._id.toString()

      user = await Create("users", newUser)
      break
    default:
      user = null
      break
  }

  return user
}

export const UpdateUser = async (userUpdate: any, id: string) => {
  let user: User | null

  switch (database) {
    case "mongodb":
      // Mongoose function to update specified user
      user = await UserModel.findByIdAndUpdate(id, userUpdate, { new: true })
      break
    case "postgresql":
      // PostgreSQL update
      user = await Update("users", userUpdate, id)
      break
    default:
      user = null
      break
  }

  return user
}

export const DeleteUser = async (id: string) => {
  let user: User | null

  switch (database) {
    case "mongodb":
      // Mongoose function to remove specified user
      user = await UserModel.findByIdAndDelete(id)
      break
    case "postgresql":
      // PostgreSQL deletion
      user = await Delete("users", id)
      break
    default:
      user = null
      break
  }

  return user
}
