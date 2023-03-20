import { logger } from "../winston"
import { modeProcess } from "../utils"

/**
 * Custom error handler for exceptions throwed during API requests
 * @param {Error} error The error throwed
 * @param {*} request The request that throwed the error
 * @param {*} res The response object to send information to the client
 */
export const errorHandler = (error: any, request: any, res: any) => {
  try {
    if (error instanceof Error) error = JSON.parse(error.message)
  } catch (e) {
    // if parse fails, error is a string
  }

  const errorData = {
    name: error.name,
    message: error.message,
    stack: error.stack,
  }

  // Throw a new error on winston
  logger.error(error.stack || error.message, error)

  // Build the error to send into response body
  const errorBody = {
    status: "error",
    // In development mode include also error details
    ...(modeProcess !== "Production" && {
      error: errorData,
    }),
    msg: error.message || "Internal server error",
    statusCode: error.statusCode || 500, // default status code
  }

  // Send the message to the client
  return res.code(errorBody.statusCode).send(errorBody)
}
