import config from "config"
import { errorHandler } from "./middlewares/errors"
import { AddressInfo } from "net"
import { app } from "./server"
import { connectToDB } from "./startup/db"
import { logger } from "./winston"
import moment from "moment"

const appAddress = app.server.address() as AddressInfo

// Set the app error handler
app.setErrorHandler(errorHandler)

// Connect to DB
connectToDB()

const start = async () => {
  await app.listen(config.get("PORT"))

  // Don't logs on test environment
  if (process.env.NODE_ENV == "test") return

  console.log(`Server listening on ${appAddress.port} ${moment()} in ${config.get("MODE")} mode`)

  logger.info(`Server listening on ${appAddress.port} in ${config.get("MODE")} mode`)
}

// Start the server
start()
