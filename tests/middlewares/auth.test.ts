import "mocha"
import chai from "chai"
import sinon from "sinon"
import chaiAsPromised from "chai-as-promised"

const expect = chai.expect
chai.use(chaiAsPromised)

import jwt from "jsonwebtoken"
import config from "config"
import { userClaims, UserPayload } from "../../types"
import { getMockedRequest, getMockedResponse } from "../utils"
import { faker } from "@faker-js/faker"
import mongoose from "mongoose"

import { default as auth } from "../../middlewares/auth"
import * as authController from "../../controllers/authController"
import { encrypter } from "../../utils"
import * as token from "../../utils/token"

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

const getFakeRefreshToken = () => {
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

    it("should return 'missing token'", async () => {
      return expect(await auth(mockedRequest, mockedResponse)).to.be.equal("Missing Token")
    })

    after(() => {
      sinon.restore()
    })
  })

  describe("When token is not missing", () => {
    describe("When isExpired fails", () => {
      before(() => {
        mockedRequest = getMockedRequest({
          headers: {
            authorization: encrypter.generateJwt("access", getFakeUsers(1)[0]) as string,
            refresh: encrypter.generateJwt("refresh", getFakeUsers(1)[0]) as string,
          },
        })

        mockedResponse = getMockedResponse()

        sinon.stub(token, "isExpired").rejects()
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

    describe("When isExpired succedes and both tokens are expired", () => {
      describe("When DeleteRefreshTokenFromToken fails", () => {
        before(() => {
          mockedRequest = getMockedRequest({
            headers: {
              authorization: encrypter.generateJwt("access", getFakeUsers(1)[0]) as string,
              refresh: encrypter.generateJwt("refresh", getFakeUsers(1)[0]) as string,
            },
          })

          mockedResponse = getMockedResponse()

          sinon.stub(token, "isExpired").resolves("expired")

          sinon.stub(authController, "DeleteRefreshTokenFromToken").rejects()
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

      describe("When DeleteRefreshTokenFromToken succedes", () => {
        const refreshToken = getFakeRefreshToken() as { token: string; userId: mongoose.Types.ObjectId }

        before(() => {
          mockedRequest = getMockedRequest({
            headers: {
              authorization: encrypter.generateJwt("access", getFakeUsers(1)[0]) as string,
              refresh: encrypter.generateJwt("refresh", getFakeUsers(1)[0]) as string,
            },
          })

          mockedResponse = getMockedResponse()

          sinon.stub(token, "isExpired").resolves("expired")

          sinon.stub(authController, "DeleteRefreshTokenFromToken").resolves(refreshToken)
        })

        it("should return 'Refresh Token Expired'", async () => {
          return expect(await auth(mockedRequest, mockedResponse)).to.be.equal("Refresh Token Expired")
        })

        after(() => {
          sinon.restore()
        })
      })
    })

    describe("When isExpired succedes and tokens are not expired", () => {
      describe("When getLoggedUser fails", () => {
        before(() => {
          mockedRequest = getMockedRequest({
            headers: {
              authorization: encrypter.generateJwt("access", getFakeUsers(1)[0]) as string,
              refresh: encrypter.generateJwt("refresh", getFakeUsers(1)[0]) as string,
            },
          })

          mockedResponse = getMockedResponse()

          sinon.stub(token, "isExpired").resolves({
            _id: "63f3974daffe19b9f50604d5",
            email: "admin@apmverniciature.io",
            role: "admin",
            iat: 1678451086,
            exp: 1678465486,
          } as UserPayload)

          sinon.stub(token, "getLoggedUser").rejects()
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

      describe("When getLoggedUser succedes", () => {
        describe("When user dosn't exists", () => {
          before(() => {
            mockedRequest = getMockedRequest({
              headers: {
                authorization: encrypter.generateJwt("access", getFakeUsers(1)[0]) as string,
                refresh: encrypter.generateJwt("refresh", getFakeUsers(1)[0]) as string,
              },
            })

            mockedResponse = getMockedResponse()

            sinon.stub(token, "isExpired").resolves({
              _id: "63f3974daffe19b9f50604d5",
              email: "admin@apmverniciature.io",
              role: "admin",
              iat: 1678451086,
              exp: 1678465486,
            } as UserPayload)

            sinon.stub(token, "getLoggedUser").resolves(undefined)
          })

          it("should return 'Authentication failed'", async () => {
            return expect(await auth(mockedRequest, mockedResponse)).to.be.equal("Authentication failed")
          })

          after(() => {
            sinon.restore()
          })
        })

        describe("When user exists", () => {
          const decodedToken = {
            _id: "63f3974daffe19b9f50604d5",
            email: "admin@apmverniciature.io",
            role: "admin",
            iat: 1678451086,
            exp: 1678465486,
          }

          before(() => {
            mockedRequest = getMockedRequest({
              headers: {
                authorization: encrypter.generateJwt("access", getFakeUsers(1)[0]) as string,
                refresh: encrypter.generateJwt("refresh", getFakeUsers(1)[0]) as string,
              },
            })

            mockedResponse = getMockedResponse()

            sinon.stub(token, "isExpired").resolves(decodedToken as UserPayload)

            sinon.stub(token, "getLoggedUser").resolves(getFakeUsers(1)[0])
          })

          it("should set decoded token in req.user", async () => {
            await auth(mockedRequest, mockedResponse)

            return expect(mockedRequest.user).to.be.equal(decodedToken)
          })

          after(() => {
            sinon.restore()
          })
        })
      })
    })
  })
})
