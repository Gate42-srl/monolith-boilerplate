import "mocha"
import chai from "chai"
import sinon from "sinon"
import chaiAsPromised from "chai-as-promised"

const expect = chai.expect
chai.use(chaiAsPromised)

import {
  allUsersHandler,
  userByIdHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from "../../routes/handlers/userHandler"

import * as userController from "../../controllers/userController"

import mongoose from "mongoose"
import { faker } from "@faker-js/faker"
import { getMockedRequest, getMockedResponse } from "../utils"

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

describe("User handler tests", () => {
  describe("Get all users test", () => {
    let mockedRequest: any
    let mockedResponse: any
    const handler = allUsersHandler
    const users = getFakeUsers(3)

    describe("When GetAllUsers database function fails", () => {
      before(() => {
        mockedRequest = getMockedRequest()
        mockedResponse = getMockedResponse()

        sinon.stub(userController, "GetAllUsers").rejects()
      })

      it("should reject", () => {
        return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When GetAllUsers database function succedes", () => {
      before(() => {
        mockedRequest = getMockedRequest()
        mockedResponse = getMockedResponse()

        sinon.stub(userController, "GetAllUsers").resolves(users)
      })

      it("should fulfil", () => {
        return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })

  describe("Get user by id test", () => {
    let mockedRequest: any
    let mockedResponse: any
    const handler = userByIdHandler
    const user = getFakeUsers(1)[0]

    describe("When GetUserById database function fails", () => {
      before(() => {
        mockedRequest = getMockedRequest({ params: { id: user._id } })
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
        mockedRequest = getMockedRequest({ params: { id: user._id } })
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

  describe("Create user test", () => {
    let mockedRequest: any
    let mockedResponse: any
    const handler = createUserHandler
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

          sinon.stub(userController, "GetUserByEmail").resolves(undefined)
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
        before(() => {
          mockedRequest = getMockedRequest({ body: user })
          mockedResponse = getMockedResponse()

          sinon.stub(userController, "GetUserByEmail").resolves(undefined)
          sinon.stub(userController, "CreateUser").resolves(user)
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

  describe("Update user test", () => {
    let mockedRequest: any
    let mockedResponse: any
    const handler = updateUserHandler
    const user = getFakeUsers(1)[0]

    describe("When GetUserByEmail database function fails", () => {
      before(() => {
        mockedRequest = getMockedRequest({ body: user, params: { id: user._id } })
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
          mockedRequest = getMockedRequest({ body: user, params: { id: user._id } })
          mockedResponse = getMockedResponse()

          sinon.stub(userController, "GetUserByEmail").resolves(undefined)
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
        before(() => {
          mockedRequest = getMockedRequest({ body: user, params: { id: user._id } })
          mockedResponse = getMockedResponse()

          sinon.stub(userController, "GetUserByEmail").resolves(undefined)
          sinon.stub(userController, "UpdateUser").resolves(user)
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

  describe("Delete user test", () => {
    let mockedRequest: any
    let mockedResponse: any
    const handler = deleteUserHandler
    const user = getFakeUsers(1)[0]

    describe("When DeleteUser database function fails", () => {
      before(() => {
        mockedRequest = getMockedRequest({ params: { id: user._id } })
        mockedResponse = getMockedResponse()

        sinon.stub(userController, "DeleteUser").rejects()
      })

      it("should reject", () => {
        return expect(handler(mockedRequest, mockedResponse)).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When DeleteUser database function succedes", () => {
      before(() => {
        mockedRequest = getMockedRequest({ params: { id: user._id } })
        mockedResponse = getMockedResponse()

        sinon.stub(userController, "DeleteUser").resolves(user)
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
