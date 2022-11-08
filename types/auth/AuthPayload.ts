export interface UserPayload {
  _id: string
  email: string
  role: "admin" | "user"
  expire?: Date
  iat?: number
}

export interface RefreshUserPayload {
  email: string
  expire?: Date
  iat?: number
}

export type AuthPayload = UserPayload | RefreshUserPayload
