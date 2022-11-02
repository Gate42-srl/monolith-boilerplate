import { logger } from "../winston"
import { UserModel } from "../models"
import mongoose, { ConnectOptions } from "mongoose"
import config from "config"
import moment from "moment"

// Handle connection error then disconnect all connections
mongoose.connection.on("error", (error) => {
  console.error("Error in MongoDb connection:", error)
  // Logs on winston
  logger.error(`Error in MongoDb connection:`, error)
  mongoose.disconnect()
})

// Handle mongoose disconnections. Then try to reconnect
mongoose.connection.on("disconnected", function () {
  // Don't reconnect on test environment
  if (process.env.NODE_ENV == "test") return

  console.log("MongoDB disconnected! Trying to reconnect after 5 sec...", moment().format())
  // Logs on winston
  logger.error(`MongoDB disconnected! Trying to reconnect after 5 sec...`, {
    timestamp: moment.utc().format(),
  })
  // After 5 seconds try to reconnect to db
  setTimeout(connectToDB, 5000)
})

/**
 * @async @function dbCheck
 * @description Utility function that check if the admin user is stored on db
 */
async function dbCheck() {
  const users = await UserModel.find()
  if (users.length) return

  /* const admin = {
      email: "",
      role: "admin",
      password: "Superman42",
    } */

  // Don't logs on test environment
  if (process.env.NODE_ENV == "test") return

  logger.info(`Database initialized`)
}

/**
 * @function connectToDB
 * @description Utility function that estabilish a connection to to the database
 */
export const connectToDB = async () => {
  const connection = await mongoose
    .connect(config.get("DATABASE_URI"), {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    } as ConnectOptions)
    .catch(console.error)

  // Don't init db and don't logs on test environment
  if (process.env.NODE_ENV == "test") return connection

  // Check for init
  dbCheck()

  console.log("MongoDB connected...", moment().format())
  // Logs on winston
  logger.info(`Database connection established`, {
    timestamp: moment.utc().format(),
  })

  return connection
}
