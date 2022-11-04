import { UserModel } from "../models"
import { User } from "../types"

//regex for password validation
const VALID_PASSWORD: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/

// This controller is used to handler operations on users
export function authController(fastify: any, opts: any, done: any) {
  fastify.post("/signup", async (req: any, res: any) => {
    const { email } = req.body

    //if an user inserts a password who does not respect the pattern (one upper case, one special char, min. length 8) rejects the request
    if (!VALID_PASSWORD.test(req.body.password))
      return res.code(400).send("Password should have one upper case, one special character and a minimum length of 8")

    if (await UserModel.findOne({ email })) return res.code(400).send("Email already used")

    // Creates and saves the user
    const savedUser: User = await new UserModel(req.body).save()

    return savedUser
  })

  done()
}
