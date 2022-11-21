import type { JSONSchemaType } from "ajv"
import Ajv, { ValidateFunction } from "ajv"
import addFormats from "ajv-formats"

const ajv = new Ajv({ coerceTypes: true, allErrors: true })

addFormats(ajv)

export const getMockedRequest = (options: any = {}) => {
  const req = {
    ...options,
  }

  return req
}

export const getMockedResponse = () => {
  const res = {
    code: function (code: number) {
      return {
        send: function (response: any) {
          return response
        },
      }
    },
  }

  return res
}

export const validateFunction: ValidateFunction = ajv.compile({
  type: "object",
  properties: {
    key: {
      type: "string",
    },
  },
  required: ["key"],
  additionalProperties: false,
} as JSONSchemaType<{
  key: string
}>)
