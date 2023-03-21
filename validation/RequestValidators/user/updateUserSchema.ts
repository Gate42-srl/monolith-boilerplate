import type { JSONSchemaType } from "ajv"

export const updateUserSchema: JSONSchemaType<{
  email: string
  password: string
  firstName: string
  lastName: string
  role: string
  status: string
  lastLogin: string
}> = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
      minLength: 1,
    },
    password: {
      type: "string",
      format: "password",
      pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#%£$&()-.+,"'=;:_|<>]{8,16}$`, // min 8, max 16, lowecase, uppercase, number
    },
    firstName: {
      type: "string",
      minLength: 1,
    },
    lastName: {
      type: "string",
      minLength: 1,
    },
    role: {
      type: "string",
      enum: ["admin", "user"],
      minLength: 1,
    },
    status: {
      type: "string",
      enum: ["active", "expired"],
    },
    lastLogin: {
      type: "string",
    },
  },
  required: ["email", "password", "firstName", "lastName", "role", "status", "lastLogin"],
  additionalProperties: false,
}
