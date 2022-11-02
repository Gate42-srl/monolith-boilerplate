import { userController } from "../controllers/userController"
import { authController } from "../controllers/authController"

export function routes(fastify: any, opts: any, next: any) {
  fastify.register(userController, { prefix: "/api/users" })
  fastify.register(authController, { prefix: "/api/auth" })

  next()
}
