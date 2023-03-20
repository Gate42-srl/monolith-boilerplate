import { routes } from "./routes"
import { default as authMiddleware } from "./middlewares/auth"
import config from "config"
import { swaggerPath } from "./swagger"
import fastify from "fastify"
import jwt from "fastify-jwt"
import fastifyCORS from "fastify-cors"
import fastifyExpress from "fastify-express"
import fastifyWebSocket from "fastify-websocket"
import { logger, JWT_SECRET } from "./utils"

export const app = fastify({ logger })

// Register fastify-jwt
app.register(jwt, {
  secret: JWT_SECRET,
})

// Register fastifyCORS
app.register(fastifyCORS, {
  origin: true,
})

// Register fastify websocket
app.register(fastifyWebSocket, { options: { clientTracking: true } })

// Register swagger docs
app.register(require("fastify-serve-swagger-ui"), {
  // swagger specification
  specification: {
    type: "file",
    path: swaggerPath,
  },
  // path under which swagger-ui will be available
  path: "api-docs",
})

// Register all our routes
app.register(routes)

// Use auth middleware
app.decorate("authenticate", authMiddleware)

// Register fastify-Express
app.register(fastifyExpress)

app.get("/", function (req, res) {
  res.code(200).send("TESTING")
})
