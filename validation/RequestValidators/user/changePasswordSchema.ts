import type { JSONSchemaType } from "ajv"

export const changePasswordSchema: JSONSchemaType<{
  password: string
}> = {
  type: "object",
  properties: {
    password: {
      type: "string",
      format: "password",
      pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#%£$&()-.+,"'=;:_|<>]{8,16}$`, // min 8, max 16, lowecase, uppercase, number
    },
  },
  required: ["password"],
  additionalProperties: false,
}
