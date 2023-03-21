import type { JSONSchemaType } from "ajv"

export const passwordRecoverSchema: JSONSchemaType<{
  email: string
}> = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
      minLength: 1,
    },
  },
  required: ["email"],
  additionalProperties: false,
}
