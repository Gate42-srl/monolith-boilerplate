import { UserModel } from "../models"
import { User } from "../types"
import { encrypter } from "../utils"

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

    return res.status(200).send(savedUser)
  })

  fastify.post("/login", async (req: any, res: any) => {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })

    if (!user) return res.code(404).send("Email not found.")

    const passwordMatched = await encrypter.comparePassword(password, user.password)

    if (!passwordMatched) return res.code(401).send("Wrong password.")

    const updateLastLogin = await UserModel.findByIdAndUpdate(user._id, { lastLogin: new Date() })

    if (!updateLastLogin) return res.code(500).send("Error updating user")

    const token = await encrypter.generateJwt(user._id, user.email, user.role)

    return res.status(200).send(token)
  })

  done()
}
