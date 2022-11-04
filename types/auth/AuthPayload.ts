interface UserPayload {
  _id: string
  email: string
  role: "admin" | "user"
  expire?: Date
  iat?: number
}

interface RefreshUserPayload {
  email: string
  expire?: Date
  iat?: number
}

export type AuthPayload = UserPayload | RefreshUserPayload
