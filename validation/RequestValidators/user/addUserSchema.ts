import type { JSONSchemaType } from "ajv"

export const addUserSchema: JSONSchemaType<{
  email: string
  password: string
  firstName: string
  lastName: string
  role?: string
  status?: string
  lastLogin?: string
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
      pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$",
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
      nullable: true,
    },
    status: {
      type: "string",
      enum: ["active", "expired"],
      nullable: true,
    },
    lastLogin: {
      type: "string",
      nullable: true,
    },
  },
  required: ["email", "password", "firstName", "lastName"],
  additionalProperties: false,
}
