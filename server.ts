import { routes } from "./routes"
import config from "config"
import fastify from "fastify"
import jwt from "fastify-jwt"
import fastifyExpress from "fastify-express"

const logger: boolean = config.get("LOGGER")

export const app = fastify({ logger })

// Register fastify-jwt
app.register(jwt, {
  secret: config.get("JWT_SECRET"),
})

// Register all our routes
app.register(routes)

app.register(fastifyExpress)

app.get("/", function (req, reply) {
  reply.code(200).send("TESTING")
})
