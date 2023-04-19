import "mocha"
import chai from "chai"
import sinon from "sinon"
import chaiAsPromised from "chai-as-promised"

const expect = chai.expect
chai.use(chaiAsPromised)

import {
  signUpHandler,
  loginHandler,
  tokenRefreshHandler,
  retrieveUserHandler,
  recoverPasswordHandler,
} from "../../routes/handlers/authHandler"

import * as authController from "../../controllers/authController"
import * as userController from "../../controllers/userController"

import mongoose from "mongoose"

import { getMockedRequest, getMockedResponse, getFakeUsers, getFakeRefreshToken } from "../utils"

import { encrypter } from "../../utils"
import * as token from "../../utils/token"
import * as emails from "../../utils/emails"

describe("Auth handler tests", () => {
  describe("Sign up handler test", () => {
    let mockedRequest: any
    let mockedResponse: any
    const handler = signUpHandler
    const user = getFakeUsers(1)[0]

    describe("When GetUserByEmail database function fails", () => {
      before(() => {
        mockedRequest = getMockedRequest({ body: user })
        mockedResponse = getMockedResponse()

        sinon.stub(userController, "GetUserByEmail").rejects()
      })

      it("should reject", () => {
        return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When GetUserByEmail database function succedes", () => {
      describe("When CreateUser database function fails", () => {
        before(() => {
          mockedRequest = getMockedRequest({ body: user })
          mockedResponse = getMockedResponse()

          sinon.stub(userController, "GetUserByEmail").resolves(null)
          sinon.stub(userController, "CreateUser").rejects()
        })

        it("should reject", () => {
          return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
        })

        after(() => {
          sinon.restore()
        })
      })

      describe("When CreateUser database function succedes", () => {
        describe("When GetRefreshTokenFromUserId database function fails", () => {
          before(() => {
            mockedRequest = getMockedRequest({ body: user })
            mockedResponse = getMockedResponse()

            sinon.stub(userController, "GetUserByEmail").resolves(null)
            sinon.stub(userController, "CreateUser").resolves(user)
            sinon.stub(authController, "GetRefreshTokenFromUserId").rejects()
          })

          it("should reject", () => {
            return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
          })

          after(() => {
            sinon.restore()
          })
        })

        describe("When GetRefreshTokenFromUserId database function succedes", () => {
          describe("When CreateRefreshToken database function fails", () => {
            before(() => {
              mockedRequest = getMockedRequest({ body: user })
              mockedResponse = getMockedResponse()

              sinon.stub(userController, "GetUserByEmail").resolves(null)
              sinon.stub(userController, "CreateUser").resolves(user)
              sinon.stub(authController, "GetRefreshTokenFromUserId").resolves(undefined)
              sinon.stub(authController, "CreateRefreshToken").rejects()
            })

            it("should reject", () => {
              return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
            })

            after(() => {
              sinon.restore()
            })
          })

          describe("When CreateRefreshToken database function succedes", () => {
            const refreshToken = getFakeRefreshToken() as { token: string; userId: mongoose.Types.ObjectId }

            before(() => {
              mockedRequest = getMockedRequest({ body: user })
              mockedResponse = getMockedResponse()

              sinon.stub(userController, "GetUserByEmail").resolves(null)
              sinon.stub(userController, "CreateUser").resolves(user)
              sinon.stub(authController, "GetRefreshTokenFromUserId").resolves(undefined)
              sinon.stub(authController, "CreateRefreshToken").resolves(refreshToken)
            })

            it("should fulfil", () => {
              return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.fulfilled
            })

            after(() => {
              sinon.restore()
            })
          })
        })
      })
    })
  })

  describe("Login handler test", () => {
    let mockedRequest: any
    let mockedResponse: any
    const handler = loginHandler
    const user = getFakeUsers(1)[0]

    describe("When GetUserByEmail database function fails", () => {
      before(() => {
        mockedRequest = getMockedRequest({ body: { email: user.email, password: user.password } })
        mockedResponse = getMockedResponse()

        sinon.stub(userController, "GetUserByEmail").rejects()
      })

      it("should reject", () => {
        return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When GetUserByEmail database function succedes", () => {
      describe("When UpdateUser database function fails", () => {
        before(() => {
          mockedRequest = getMockedRequest({ body: { email: user.email, password: user.password } })
          mockedResponse = getMockedResponse()

          sinon.stub(userController, "GetUserByEmail").resolves(user)
          sinon.stub(encrypter, "comparePassword").resolves(true)
          sinon.stub(userController, "UpdateUser").rejects()
        })

        it("should reject", () => {
          return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
        })

        after(() => {
          sinon.restore()
        })
      })

      describe("When UpdateUser database function succedes", () => {
        describe("When GetRefreshTokenFromUserId database function fails", () => {
          before(() => {
            mockedRequest = getMockedRequest({ body: { email: user.email, password: user.password } })
            mockedResponse = getMockedResponse()

            sinon.stub(userController, "GetUserByEmail").resolves(user)
            sinon.stub(encrypter, "comparePassword").resolves(true)
            sinon.stub(userController, "UpdateUser").resolves(user)
            sinon.stub(authController, "GetRefreshTokenFromUserId").rejects()
          })

          it("should reject", () => {
            return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
          })

          after(() => {
            sinon.restore()
          })
        })

        describe("When GetRefreshTokenFromUserId database function succedes", () => {
          describe("When CreateRefreshToken database function fails", () => {
            before(() => {
              mockedRequest = getMockedRequest({ body: { email: user.email, password: user.password } })
              mockedResponse = getMockedResponse()

              sinon.stub(userController, "GetUserByEmail").resolves(user)
              sinon.stub(encrypter, "comparePassword").resolves(true)
              sinon.stub(userController, "UpdateUser").resolves(user)
              sinon.stub(authController, "GetRefreshTokenFromUserId").resolves(undefined)
              sinon.stub(authController, "CreateRefreshToken").rejects()
            })

            it("should reject", () => {
              return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
            })

            after(() => {
              sinon.restore()
            })
          })

          describe("When CreateRefreshToken database function fails", () => {
            const refreshToken = getFakeRefreshToken() as { token: string; userId: mongoose.Types.ObjectId }

            before(() => {
              mockedRequest = getMockedRequest({ body: { email: user.email, password: user.password } })
              mockedResponse = getMockedResponse()

              sinon.stub(userController, "GetUserByEmail").resolves(user)
              sinon.stub(encrypter, "comparePassword").resolves(true)
              sinon.stub(userController, "UpdateUser").resolves(user)
              sinon.stub(authController, "GetRefreshTokenFromUserId").resolves(undefined)
              sinon.stub(authController, "CreateRefreshToken").resolves(refreshToken)
            })

            it("should fulfil", () => {
              return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.fulfilled
            })

            after(() => {
              sinon.restore()
            })
          })
        })
      })
    })
  })

  describe("Token refresh handler test", () => {
    let mockedRequest: any
    let mockedResponse: any
    const handler = tokenRefreshHandler
    const user = getFakeUsers(1)[0]

    describe("When isExpired token function fails", () => {
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

      it("should reject", () => {
        return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When isExpired token function succedes", () => {
      describe("When GetRefreshTokenFromToken database function fails", () => {
        before(() => {
          mockedRequest = getMockedRequest({
            headers: {
              authorization: encrypter.generateJwt("access", getFakeUsers(1)[0]) as string,
              refresh: encrypter.generateJwt("refresh", getFakeUsers(1)[0]) as string,
            },
          })

          mockedResponse = getMockedResponse()

          sinon.stub(token, "isExpired").resolves("expired")
          sinon.stub(authController, "GetRefreshTokenFromToken").rejects()
        })

        it("should reject", async () => {
          return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
        })

        after(() => {
          sinon.restore()
        })
      })

      describe("When GetRefreshTokenFromToken database function succedes", () => {
        const refreshToken = getFakeRefreshToken() as { token: string; userId: mongoose.Types.ObjectId }

        describe("When GetUserByEmail database function fails", () => {
          before(() => {
            mockedRequest = getMockedRequest({
              headers: {
                authorization: encrypter.generateJwt("access", getFakeUsers(1)[0]) as string,
                refresh: encrypter.generateJwt("refresh", getFakeUsers(1)[0]) as string,
              },
            })

            mockedResponse = getMockedResponse()

            sinon.stub(token, "isExpired").resolves("expired")
            sinon.stub(authController, "GetRefreshTokenFromToken").resolves(refreshToken)
            sinon.stub(userController, "GetUserByEmail").rejects()
          })

          it("should reject", () => {
            return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
          })

          after(() => {
            sinon.restore()
          })
        })

        describe("When GetUserByEmail database function succedes", () => {
          describe("When DeleteRefreshTokenFromToken database function fails", () => {
            before(() => {
              mockedRequest = getMockedRequest({
                headers: {
                  authorization: encrypter.generateJwt("access", getFakeUsers(1)[0]) as string,
                  refresh: encrypter.generateJwt("refresh", getFakeUsers(1)[0]) as string,
                },
              })

              mockedResponse = getMockedResponse()

              sinon.stub(token, "isExpired").resolves("expired")
              sinon.stub(authController, "GetRefreshTokenFromToken").resolves(refreshToken)
              sinon.stub(userController, "GetUserByEmail").resolves(user)
              sinon.stub(authController, "DeleteRefreshTokenFromToken").rejects()
            })

            it("should reject", () => {
              return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
            })

            after(() => {
              sinon.restore()
            })
          })

          describe("When DeleteRefreshTokenFromToken database function succedes", () => {
            describe("When CreateRefreshToken database function fails", () => {
              before(() => {
                mockedRequest = getMockedRequest({
                  headers: {
                    authorization: encrypter.generateJwt("access", getFakeUsers(1)[0]) as string,
                    refresh: encrypter.generateJwt("refresh", getFakeUsers(1)[0]) as string,
                  },
                })

                mockedResponse = getMockedResponse()

                sinon.stub(token, "isExpired").resolves("expired")
                sinon.stub(authController, "GetRefreshTokenFromToken").resolves(refreshToken)
                sinon.stub(userController, "GetUserByEmail").resolves(user)
                sinon.stub(authController, "DeleteRefreshTokenFromToken").resolves(refreshToken)
                sinon.stub(authController, "CreateRefreshToken").rejects()
              })

              it("should reject", () => {
                return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
              })

              after(() => {
                sinon.restore()
              })
            })

            describe("When CreateRefreshToken database function succedes", () => {
              before(() => {
                mockedRequest = getMockedRequest({
                  headers: {
                    authorization: encrypter.generateJwt("access", getFakeUsers(1)[0]) as string,
                    refresh: encrypter.generateJwt("refresh", getFakeUsers(1)[0]) as string,
                  },
                })

                mockedResponse = getMockedResponse()

                sinon.stub(token, "isExpired").resolves("expired")
                sinon.stub(authController, "GetRefreshTokenFromToken").resolves(refreshToken)
                sinon.stub(userController, "GetUserByEmail").resolves(user)
                sinon.stub(authController, "DeleteRefreshTokenFromToken").resolves(refreshToken)
                sinon.stub(authController, "CreateRefreshToken").resolves(refreshToken)
              })

              it("should fulfil", () => {
                return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.fulfilled
              })

              after(() => {
                sinon.restore()
              })
            })
          })
        })
      })
    })
  })

  describe("Retrieve user handler test", () => {
    let mockedRequest: any
    let mockedResponse: any
    const handler = retrieveUserHandler
    const user = getFakeUsers(1)[0]

    describe("When GetUserById database function fails", () => {
      before(() => {
        mockedRequest = getMockedRequest({ user })
        mockedResponse = getMockedResponse()

        sinon.stub(userController, "GetUserById").rejects()
      })

      it("should reject", () => {
        return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When GetUserById database function succedes", () => {
      before(() => {
        mockedRequest = getMockedRequest({ user })
        mockedResponse = getMockedResponse()

        sinon.stub(userController, "GetUserById").resolves(user)
      })

      it("should fulfil", () => {
        return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })

  describe("Recover password handler test", () => {
    let mockedRequest: any
    let mockedResponse: any
    const handler = recoverPasswordHandler
    const user = getFakeUsers(1)[0]

    describe("When GetUserByEmail database function fails", () => {
      before(() => {
        mockedRequest = getMockedRequest({ body: { email: user.email } })
        mockedResponse = getMockedResponse()

        sinon.stub(userController, "GetUserByEmail").rejects()
      })

      it("should reject", () => {
        return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When GetUserByEmail database function succedes", () => {
      describe("When sendEmail function fails", () => {
        before(() => {
          mockedRequest = getMockedRequest({ body: { email: user.email } })
          mockedResponse = getMockedResponse()

          sinon.stub(userController, "GetUserByEmail").resolves(user)
          sinon.stub(emails, "sendEmail").rejects()
        })

        it("should reject", () => {
          return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
        })

        after(() => {
          sinon.restore()
        })
      })

      describe("When sendEmail function succedes", () => {
        before(() => {
          mockedRequest = getMockedRequest({ body: { email: user.email } })
          mockedResponse = getMockedResponse()

          sinon.stub(userController, "GetUserByEmail").resolves(user)
          sinon.stub(emails, "sendEmail").resolves()
        })

        it("should fulfil", () => {
          return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.fulfilled
        })

        after(() => {
          sinon.restore()
        })
      })
    })
  })
})
