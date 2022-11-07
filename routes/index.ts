import { userHandler } from "./handlers/userHandler"
import { authHandler } from "./handlers/authHandler"
import { socketHandler } from "./handlers/socketHandler"

export async function routes(fastify: any, opts: any, done: any) {
  fastify.register(userHandler, { prefix: "/users" })
  fastify.register(authHandler, { prefix: "/auth" })
  fastify.register(socketHandler, { prefix: "/requestSocket" })

  done()
}
