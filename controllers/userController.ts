import config from "config"
const database = (config.get("DATABASE") as string).toLowerCase()

import { GetById, GetAll, Create, Update, Delete, pool } from "../databases/PostgreSQL"
import { UserModel } from "../models"
import { QueryResult } from "pg"

import { User } from "../types"

export const GetUserById = async (id: string) => {
  let user: User | void | null

  switch (database) {
    case "mongodb":
      // Mongoose function to retrieve the user by its id
      user = await UserModel.findById(id)
      break
    case "postgresql":
      // PostgreSQL query
      user = GetById("users", id)
      break
    default:
      user = null
      break
  }

  return user
}

export const GetAllUsers = async () => {
  let users: User[] | void

  switch (database) {
    case "mongodb":
      // Mongoose function to retrieve all users
      users = await UserModel.find()
      break
    case "postgresql":
      // PostgreSQL query
      users = GetAll("users")
      break
    default:
      users = []
      break
  }

  return users
}

export const GetUserByEmail = async (email: string) => {
  let user: User | QueryResult<any> | null = null

  switch (database) {
    case "mongodb":
      // Mongoose function to retrieve the user by email
      user = await UserModel.findOne({ email })
      break
    case "postgresql":
      // PostgreSQL query
      pool.query(`SELECT * FROM users WHERE email = $1`, [email], (error, results) => {
        if (error) throw error

        user = results
      })
      break
    default:
      user = null
      break
  }

  return user
}

export const CreateUser = async (userToAdd: User) => {
  let user: User | void | null

  switch (database) {
    case "mongodb":
      // Creates the user and saves it with mongoose function
      user = await new UserModel(userToAdd).save()
      break
    case "postgresql":
      // PostgreSQL insert
      const newUser = {
        _id: new UserModel(userToAdd)._id.toString(),
        email: userToAdd.email,
        password: userToAdd.password,
        firstName: userToAdd.firstName,
        lastName: userToAdd.lastName,
        role: userToAdd.role,
        status: userToAdd.status,
        lastLogin: new Date(),
      }

      user = Create("users", newUser)
      break
    default:
      user = null
      break
  }

  return user
}

export const UpdateUser = async (userUpdate: any, id: string) => {
  let user: User | void | null

  switch (database) {
    case "mongodb":
      // Mongoose function to update specified user
      user = await UserModel.findByIdAndUpdate(id, userUpdate, { new: true })
      break
    case "postgresql":
      // PostgreSQL update
      user = Update("users", userUpdate, id)
      break
    default:
      user = null
      break
  }

  return user
}

export const DeleteUser = async (id: string) => {
  let user: User | void | null

  switch (database) {
    case "mongodb":
      // Mongoose function to remove specified user
      user = await UserModel.findByIdAndDelete(id)
      break
    case "postgresql":
      // PostgreSQL deletion
      user = Delete("users", id)
      break
    default:
      user = null
      break
  }

  return user
}
