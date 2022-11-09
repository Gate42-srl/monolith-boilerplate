import config from "config"
const database = (config.get("DATABASE") as string).toLowerCase()

import { Create, pool } from "../databases/PostgreSQL"
import { refreshTokenModel } from "../models"
import { QueryResult } from "pg"

import { refreshToken } from "../types"

export const GetRefreshTokenFromUserId = async (userId: string) => {
  let refreshToken: refreshToken | null

  switch (database) {
    case "mongodb":
      // Mongoose function to retrieve the refresh token by id of the user it belongs to
      refreshToken = await refreshTokenModel.findOne({ userId })
      break
    case "postgresql":
      // PostgreSQL query
      refreshToken = (await pool.query(`SELECT * FROM refreshTokens WHERE userId = $1`, [userId])).rows[0]
      break
    default:
      refreshToken = null
      break
  }

  return refreshToken
}

export const GetRefreshTokenFromToken = async (token: string) => {
  let refreshToken: refreshToken | null

  switch (database) {
    case "mongodb":
      // Mongoose function to retrieve the refresh token by its own value
      refreshToken = await refreshTokenModel.findOne({ token })
      break
    case "postgresql":
      // PostgreSQL query
      refreshToken = (await pool.query(`SELECT * FROM refreshTokens WHERE token = $1`, [token])).rows[0]
      break
    default:
      refreshToken = null
      break
  }

  return refreshToken
}

export const CreateRefreshToken = async (newRefreshToken: refreshToken) => {
  let refreshToken: refreshToken | null

  switch (database) {
    case "mongodb":
      // Mongoose function that creates and stores refresh token into the database
      refreshToken = await new refreshTokenModel(newRefreshToken).save()
      break
    case "postgresql":
      // PostgreSQL insert
      refreshToken = await Create("refreshTokens", newRefreshToken)
      break
    default:
      refreshToken = null
      break
  }

  return refreshToken
}

export const DeleteRefreshTokenFromToken = async (token: string) => {
  let refreshToken: refreshToken | QueryResult<any> | null = null

  switch (database) {
    case "mongodb":
      // Mongoose function to delete refresh token by its own value
      refreshToken = await refreshTokenModel.findOneAndDelete({ token })
      break
    case "postgresql":
      refreshToken = (await pool.query(`SELECT * FROM refreshTokens WHERE token = $1`, [token])).rows[0]

      // PostgreSQL deletion
      await pool.query(`DELETE FROM refreshTokens WHERE token = $1`, [token])
      break
    default:
      refreshToken = null
      break
  }

  return refreshToken
}
