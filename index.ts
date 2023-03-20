import config from "config"
import { errorHandler } from "./middlewares/errors"
import { AddressInfo } from "net"
import { app } from "./server"
import { connectToDB } from "./databases"
import { logger } from "./winston"
import moment from "moment"
import { modeProcess, database, port } from "./utils"

// Set the app error handler
app.setErrorHandler(errorHandler)

const databaseConnection = async () => {
  // Connect to DB
  let result = await connectToDB(database)
  if (!result) {
    logger.error("DB connection failed...")
    throw new Error("DB connection failed...")
  }
}

databaseConnection()

const start = async () => {
  await app.listen(port, "0.0.0.0")
  const appAddress = app.server.address() as AddressInfo

  // Don't logs on test environment
  if (modeProcess == "test") return

  console.log(`Server listening on ${appAddress.port} ${moment()} in ${modeProcess} mode using ${database} database`)

  logger.info(`Server listening on ${appAddress.port} in ${modeProcess} mode using ${database} database`)
}

// Start the server
start()
