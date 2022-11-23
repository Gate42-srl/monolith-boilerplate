import config from "config"

export const modeProcess = (process.env.MODE || (config.get("MODE") as string)).toLowerCase()

export const database = process.env.DATABASE !== undefined ? process.env.DATABASE : config.get("DATABASE")

export const port = process.env.PORT !== undefined ? process.env.PORT : config.get("PORT")

export const LOCAL_ENVIRONMENT =
  process.env.LOCAL_ENVIRONMENT !== undefined ? process.env.LOCAL_ENVIRONMENT : config.get("LOCAL_ENVIRONMENT")
