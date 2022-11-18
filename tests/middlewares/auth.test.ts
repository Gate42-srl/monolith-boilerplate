import "mocha"
import chai from "chai"
import sinon from "sinon"
import chaiAsPromised from "chai-as-promised"

const expect = chai.expect
chai.use(chaiAsPromised)

import jwt from "jsonwebtoken"
import config from "config"
import { userClaims } from "../../types"

import { getMockedRequest, getMockedResponse } from "../utils"
import { faker } from "@faker-js/faker"
import mongoose from "mongoose"

import { default as auth } from "../../middlewares/auth"
import { encrypter, getLoggedUser, isExpired } from "../../utils"

export const generateExpiredJwt = (type: string, claims: userClaims): string | null => {
  const { _id, email, role } = claims
  const expire: Date = new Date(new Date().getTime() - 1000)
  const refreshExpire: Date = expire

  if (type === "access") return jwt.sign({ _id, email, role, expire }, config.get("JWT_SECRET"))
  else if (type === "refresh") return jwt.sign({ email, expire: refreshExpire }, config.get("REFRESH_SECRET"))
  else return null
}

const getFakeUsers = (amount: number) => {
  let users: any[] = []

  for (let i = 0; i < amount; i++) {
    users.push({
      _id: new mongoose.Types.ObjectId(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      role: "user",
      status: "active",
      lastLogin: new Date(),
    })
  }

  return users
}

describe("auth middleware test", () => {
  let mockedRequest: any
  let mockedResponse: any

  describe("When token is missing", () => {
    before(() => {
      mockedRequest = getMockedRequest({
        headers: {},
      })

      mockedResponse = getMockedResponse()
    })

    it("should return missing token", async () => {
      return expect(await auth(mockedRequest, mockedResponse)).to.be.equal("Missing Token")
    })

    after(() => {
      sinon.restore()
    })
  })

  describe("When token is not missing", () => {
    describe("When decode token fails", () => {
      before(() => {
        mockedRequest = getMockedRequest({
          headers: {
            authorization: encrypter.generateJwt("access", getFakeUsers(1)[0]) as string,
            refresh: encrypter.generateJwt("refresh", getFakeUsers(1)[0]) as string,
          },
        })

        mockedResponse = getMockedResponse()

        sinon.stub(encrypter, "decodeToken").rejects()
      })

      it("should throw an error", async () => {
        return expect(await auth(mockedRequest, mockedResponse)).has.throw
      })

      it("should return 'Unable to parse token'", async () => {
        return expect(await auth(mockedRequest, mockedResponse)).to.be.equal("Unable to parse token")
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When decode token succedes", () => {
      describe("When token is invalid", () => {})

      describe("When token is valid", () => {
        describe("When isExpired fails", () => {})

        describe("When isExpired succedes and both tokens are expired", () => {
          describe("When DeleteRefreshTokenFromToken fails", () => {})

          describe("When DeleteRefreshTokenFromToken succedes", () => {})
        })

        describe("When isExpired succedes and tokens are not expired", () => {
          describe("When getLoggedUser fails", () => {})

          describe("When getLoggedUser succedes", () => {
            describe("When user dosn't exists", () => {})

            describe("When user  exists", () => {})
          })
        })
      })
    })
  })
})
