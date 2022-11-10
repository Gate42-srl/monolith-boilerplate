import type { JSONSchemaType } from "ajv"

export const loginSchema: JSONSchemaType<{
  email: string
  password: string
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
    },
  },
  required: ["email", "password"],
  additionalProperties: false,
}
