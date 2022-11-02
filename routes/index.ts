import { userController } from "../controllers/userController"

export function routes(fastify: any, opts: any, next: any) {
  fastify.register(userController, { prefix: "/api/users" })

  next()
}
