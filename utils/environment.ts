import config from "config"

const setBool = (string: string) => {
  if (string === "true") return true
  else return false
}

// Environment the application is going to run
export const modeProcess = (process.env.MODE || (config.get("MODE") as string)).toLowerCase()

// Port the application is going to run
export const port: number = process.env.PORT !== undefined ? parseInt(process.env.PORT) : config.get("PORT")

// Logger option for fastify
export const logger: boolean = process.env.LOGGER !== undefined ? setBool(process.env.LOGGER) : config.get("LOGGER")

// Local environment or remote environment
export const LOCAL_ENVIRONMENT: boolean =
  process.env.LOCAL_ENVIRONMENT !== undefined ? setBool(process.env.LOCAL_ENVIRONMENT) : config.get("LOCAL_ENVIRONMENT")

// Database to use (mongodb by default). Can be set to "postgresql".
export const database: string =
process.env.DATABASE !== undefined
  ? (process.env.DATABASE as string).toLowerCase()
  : (config.get("DATABASE") as string).toLowerCase()

// MongoDB URI
export const databaseUri: string =
process.env.DATABASE_URI !== undefined ? process.env.DATABASE_URI : config.get("DATABASE_URI")

// Key to generate authentication token
export const JWT_SECRET: string =
  process.env.JWT_SECRET !== undefined
    ? (process.env.JWT_SECRET as string).toLowerCase()
    : (config.get("JWT_SECRET") as string).toLowerCase()

// Key to generate refresh token
export const REFRESH_SECRET: string =
  process.env.REFRESH_SECRET !== undefined
    ? (process.env.REFRESH_SECRET as string).toLowerCase()
    : (config.get("REFRESH_SECRET") as string).toLowerCase()

// Key to generate password reset token
export const PASSWORD_RESET_SECRET: string =
  process.env.PASSWORD_RESET_SECRET !== undefined
    ? (process.env.PASSWORD_RESET_SECRET as string).toLowerCase()
    : (config.get("PASSWORD_RESET_SECRET") as string).toLowerCase()

// Your deployment URL
export const BASE_URL: string = process.env.BASE_URL !== undefined ? (process.env.PASSWORD_RESET_SECRET as string) : config.get(
  "BASE_URL"
)
