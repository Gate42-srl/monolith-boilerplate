import bcrypt from "bcrypt"
import config from "config"
import jwt from "jsonwebtoken"
import { AuthPayload, RefreshUserPayload, UserPayload, userClaims } from "../types"

const expire: Date = new Date(new Date().getTime() + 240 * 60000)
const refreshExpire: Date = new Date(expire.getTime() * 6)

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

  if (type === "access") return jwt.sign({ _id, email, role, expire }, config.get("JWT_SECRET"))
  else if (type === "refresh") return jwt.sign({ email, expire: refreshExpire }, config.get("REFRESH_SECRET"))
  else return null
}

export const decodeToken = async (type: string, token: string) => {
  const decodedToken: UserPayload | RefreshUserPayload =
    type === "access"
      ? ((await jwt.verify(token, config.get("JWT_SECRET"))) as AuthPayload)
      : ((await jwt.verify(token, config.get("REFRESH_SECRET"))) as AuthPayload)

  return decodedToken
}
