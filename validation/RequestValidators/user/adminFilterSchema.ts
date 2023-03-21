import type { JSONSchemaType } from "ajv"

export const adminFilterSchema: JSONSchemaType<{
  email?: string
  lastname?: string
}> = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
      minLength: 1,
      nullable: true,
    },
    lastname: {
      type: "string",
      minLength: 1,
      nullable: true,
    },
  },
  required: [],
  additionalProperties: false,
}
