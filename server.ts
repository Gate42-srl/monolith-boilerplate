import { routes } from "./routes"
import config from "config"
import fastify from "fastify"
import jwt from "fastify-jwt"

const logger: boolean = config.get("LOGGER")

export const app = fastify({ logger })

// Register fastify-jwt
app.register(jwt, {
  secret: config.get("JWT_SECRET"),
})

// Register all our routes
app.register(routes)
