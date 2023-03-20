import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AuthPayload, userClaims } from "../types"
import { JWT_SECRET, PASSWORD_RESET_SECRET, REFRESH_SECRET } from "./environment"

// WSconst expire: Date = new Date(new Date().getTime() - 1000) // GENERATES AN EXPIRED TOKEN FOR TESTING
// const expire: Date = new Date(new Date().getTime() + 240 * 60000)
const expire: string = "4h"
// const refreshExpire: Date = new Date(expire.getTime()) // GENERATES AN EXPIRED REFRESH TOKEN FOR TESTING
// const refreshExpire: Date = new Date(expire.getTime() + 864 * 100000)
const refreshExpire: string = "24h"

/**
 * @function encryptPassword
 * @description It takes a string, hashes it, and returns a promise that resolves to a string
 * @param {string} password - The password to hash
 * @returns A Promise that resolves to a string.
 */
export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 10)
}

/**
 * @function comparePassword
 * @description It takes a password and a hash, and returns a promise that resolves to true if the password matches
 * the hash, and false if it doesn't
 * @param {string} password - The password to be hashed
 * @param {string} hash - The hash you want to compare the password to.
 * @returns A promise that resolves to a boolean.
 */
export const comparePassword = (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

export const generateJwt = (type: string, claims: userClaims): string | null => {
  const { _id, email, role } = claims

  switch (type) {
    case "access":
      return jwt.sign({ _id, email, role }, JWT_SECRET, {
        expiresIn: expire,
      })
    case "refresh":
      return jwt.sign({ email }, REFRESH_SECRET, {
        expiresIn: refreshExpire,
      })
    case "passwordReset":
      return jwt.sign({ _id }, PASSWORD_RESET_SECRET, {
        expiresIn: "48h",
      })
    default:
      return null
  }
}

export const decodeToken = async (type: string, token: string) => {
  switch (type) {
    case "access":
      return (await jwt.verify(token, JWT_SECRET)) as AuthPayload
    case "refresh":
      return (await jwt.verify(token, REFRESH_SECRET)) as AuthPayload
    case "passwordReset":
      return (await jwt.verify(token, PASSWORD_RESET_SECRET)) as AuthPayload
    default:
      return null
  }
}
