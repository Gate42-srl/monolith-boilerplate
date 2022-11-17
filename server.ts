import { routes } from "./routes"
import { default as authMiddleware } from "./middlewares/auth"
import config from "config"
import fastify from "fastify"
import jwt from "fastify-jwt"
import fastifyCORS from "fastify-cors"
import fastifyExpress from "fastify-express"
import fastifyWebSocket from "fastify-websocket"

const logger: boolean = config.get("LOGGER")

export const app = fastify({ logger })

// Register fastify-jwt
app.register(jwt, {
  secret: config.get("JWT_SECRET"),
})

// Register fastifyCORS
app.register(fastifyCORS, {
  origin: true,
})

// Register fastify websocket
app.register(fastifyWebSocket, { options: { clientTracking: true } })

// Register all our routes
app.register(routes)

// Use auth middleware
app.decorate("authenticate", authMiddleware)

// Register fastify-Express
app.register(fastifyExpress)

app.get("/", function (req, res) {
  res.code(200).send("TESTING")
})
