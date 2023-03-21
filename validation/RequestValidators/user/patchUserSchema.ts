import type { JSONSchemaType } from "ajv"

export const patchUserSchema: JSONSchemaType<{
  email?: string
  password?: string
  firstName?: string
  lastName?: string
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
      nullable: true,
    },
    password: {
      type: "string",
      format: "password",
      pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#%£$&()-.+,"'=;:_|<>]{8,16}$`, // min 8, max 16, lowecase, uppercase, number
      nullable: true,
    },
    firstName: {
      type: "string",
      minLength: 1,
      nullable: true,
    },
    lastName: {
      type: "string",
      minLength: 1,
      nullable: true,
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
  required: [],
  additionalProperties: false,
}
