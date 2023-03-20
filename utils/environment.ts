import config from "config"

const setBool = (string: string) => {
  if (string === "true") return true
  else return false
}

export const modeProcess = (process.env.MODE || (config.get("MODE") as string)).toLowerCase()

export const database: string =
  process.env.DATABASE !== undefined
    ? (process.env.DATABASE as string).toLowerCase()
    : (config.get("DATABASE") as string).toLowerCase()

export const port: number = process.env.PORT !== undefined ? parseInt(process.env.PORT) : config.get("PORT")

export const logger: boolean = process.env.LOGGER !== undefined ? setBool(process.env.LOGGER) : config.get("LOGGER")

export const LOCAL_ENVIRONMENT: boolean =
  process.env.LOCAL_ENVIRONMENT !== undefined ? setBool(process.env.LOCAL_ENVIRONMENT) : config.get("LOCAL_ENVIRONMENT")

export const databaseUri: string =
  process.env.DATABASE_URI !== undefined ? process.env.DATABASE_URI : config.get("DATABASE_URI")

export const JWT_SECRET: string =
  process.env.JWT_SECRET !== undefined
    ? (process.env.JWT_SECRET as string).toLowerCase()
    : (config.get("JWT_SECRET") as string).toLowerCase()

export const REFRESH_SECRET: string =
  process.env.REFRESH_SECRET !== undefined
    ? (process.env.REFRESH_SECRET as string).toLowerCase()
    : (config.get("REFRESH_SECRET") as string).toLowerCase()

export const PASSWORD_RESET_SECRET: string =
  process.env.PASSWORD_RESET_SECRET !== undefined
    ? (process.env.PASSWORD_RESET_SECRET as string).toLowerCase()
    : (config.get("PASSWORD_RESET_SECRET") as string).toLowerCase()
