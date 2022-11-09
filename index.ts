import config from "config"
import { errorHandler } from "./middlewares/errors"
import { AddressInfo } from "net"
import { app } from "./server"
import { connectToDB } from "./databases"
import { logger } from "./winston"
import moment from "moment"

// Set the app error handler
app.setErrorHandler(errorHandler)

const databaseConnection = async () => {
  // Connect to DB
  let result = await connectToDB(config.get("DATABASE"))
  if (!result) {
    logger.error("DB connection failed...")
    throw new Error("DB connection failed...")
  }
}

databaseConnection()

const start = async () => {
  await app.listen(config.get("PORT"), "0.0.0.0")
  const appAddress = app.server.address() as AddressInfo

  // Don't logs on test environment
  if (config.get("MODE") == "test") return

  console.log(
    `Server listening on ${appAddress.port} ${moment()} in ${config.get("MODE")} mode using ${config.get(
      "DATABASE"
    )} database`
  )

  logger.info(
    `Server listening on ${appAddress.port} in ${config.get("MODE")} mode using ${config.get("DATABASE")} database`
  )
}

// Start the server
start()
