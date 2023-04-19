import { faker } from "@faker-js/faker"
import mongoose from "mongoose"
import { encrypter } from "../utils"

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
    status: function (code: number) {
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

export const getFakeUsers = (amount: number) => {
  let users: any[] = []

  for (let i = 0; i < amount; i++) {
    users.push({
      _id: new mongoose.Types.ObjectId(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      role: "user",
      status: "active",
      lastLogin: new Date(),
    })
  }

  return users
}

export const getFakeRefreshToken = () => {
  const id = new mongoose.Types.ObjectId()

  return {
    token: encrypter.generateJwt("refresh", {
      _id: id,
      email: faker.internet.email(),
      role: "user",
    }),
    userId: id,
  }
}
