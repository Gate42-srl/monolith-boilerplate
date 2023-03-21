import { routes } from "./routes"
import { default as authMiddleware } from "./middlewares/auth"
import { swaggerPath } from "./swagger"
import fastify from "fastify"
import jwt from "fastify-jwt"
import fastifyCORS from "fastify-cors"
import fastifyExpress from "fastify-express"
import fastifyWebSocket from "fastify-websocket"
import { logger, JWT_SECRET, LOCAL_ENVIRONMENT } from "./utils"
import path from "path"

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

// Register fastify-static
app.register((instance, opts, next) => {
  let reactBuildDir = path.join(__dirname, "../client/build")

  if (LOCAL_ENVIRONMENT === true) reactBuildDir = path.join(__dirname, "client", "build")

  instance.register(require("@fastify/static"), {
    root: reactBuildDir,
    prefix: "/react-app",
  })

  app.get("/react-app-debug", function (req, res) {
    res.send({ LOCAL_ENVIRONMENT, reactBuildDir })
  })

  app.get("/react-app", function (req, res) {
    res.redirect(301, "/react-app/")
  })

  app.get("/react-app/admin/", function (req, res) {
    res.redirect(301, "/react-app/?redirectTo=/admin/")
  })

  app.get("/react-app/login/", function (req, res) {
    res.redirect(301, "/react-app/")
  })

  app.get("/react-app/passwordReset/", function (req, res) {
    const { token } = req.query as { token: string }

    res.redirect(301, `/react-app/?redirectTo=/passwordReset/?token=${token}`)
  })

  next()
})

app.get("/", function (req, res) {
  res.code(200).send("TESTING")
})
