import moment from "moment"
import mongoose from "mongoose"

import { logger } from "../winston"
import { dbCheck } from "./dbCheck"
import { databaseUri, modeProcess } from "../utils"

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
  setTimeout(connectToMongoDB, 5000)
})

/**
 * @function connect
 * @description Utility function that estabilish a connection to to the database
 */
export const connectToMongoDB = async () => {
  const connection = await mongoose.connect(databaseUri)

  // Don't init db and don't log on test environment
  if (modeProcess == "test") return connection

  // Check for init
  await dbCheck()

  console.log("MongoDB connected...", moment().format())
  // Logs on winston
  logger.info(`Database connection established`, {
    timestamp: moment.utc().format(),
  })

  return connection
}
