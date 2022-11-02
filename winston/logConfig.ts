import winston, { format, transports } from "winston"

export const logger: winston.Logger = winston.createLogger({
  transports: [new transports.Console()],
  format: format.combine(
    winston.format.json(),
    format.colorize({ all: true }),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`
    })
  ),
})
