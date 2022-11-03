import { userController } from "../controllers/userController"
import { authController } from "../controllers/authController"

export async function routes(fastify: any, opts: any, next: any) {
  await fastify.register(userController, { prefix: "/api/users" })
  await fastify.register(authController, { prefix: "/api/auth" })

  next()
}
