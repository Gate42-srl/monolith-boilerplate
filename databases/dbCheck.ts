import { CreateUser, GetAllUsers } from "../controllers/userController"
import { User } from "../types"
import { logger } from "../winston"

/**
 * @async @function dbCheck
 * @description Utility function that check if the admin user is stored on db
 */
export async function dbCheck() {
  const users = await GetAllUsers()
  if (users.length) return

  // if there's no user in database, initialize it with an admin
  const admin = {
    email: "admin@boilerplate.io",
    password: "boilerplate",
    role: "admin",
  } as User

  await CreateUser(admin)

  // Don't logs on test environment
  if (process.env.NODE_ENV == "test") return

  logger.info(`Database initialized`)
}
