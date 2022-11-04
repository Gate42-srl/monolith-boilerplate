import bcrypt from "bcrypt"
import config from "config"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const expire: Date = new Date(new Date().getTime() + 240 * 60000)

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

export const generateJwt = (_id: mongoose.Types.ObjectId, email: string, role: string): string => {
  return jwt.sign({ _id, email, role, expire }, config.get("JWT_SECRET"))
}
