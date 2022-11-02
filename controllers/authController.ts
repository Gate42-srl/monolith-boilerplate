import { UserModel } from "../models"
import { User } from "../types"

// This controller is used to handler operations on users
export function authController(fastify: any, opts: any, next: any) {
  fastify.post("/signup", async (req: any, res: any) => {
    const { email } = req.body

    if (await UserModel.findOne({ email })) return res.code(400).send("Email already used")

    // Creates and saves the user
    const savedUser = await new UserModel(req.body).save()

    return savedUser
  })
}
