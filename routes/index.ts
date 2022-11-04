import { userController } from "../controllers/userController"
import { authController } from "../controllers/authController"

export async function routes(fastify: any, opts: any, done: any) {
  fastify.register(userController, { prefix: "/users" })
  fastify.register(authController, { prefix: "/auth" })

  done()
}
