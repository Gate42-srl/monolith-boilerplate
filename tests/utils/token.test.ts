import "mocha"
import chai from "chai"
import sinon from "sinon"
import chaiAsPromised from "chai-as-promised"

const expect = chai.expect
chai.use(chaiAsPromised)

import { isExpired, getLoggedUser } from "../../utils/token"

import mongoose from "mongoose"
import { faker } from "@faker-js/faker"
import { UserPayload } from "../../types"
import * as userController from "../../controllers/userController"
import * as encrypter from "../../utils/encryption"

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

describe("token utilty tests", () => {
  describe("isExpired function test", () => {
    const func = isExpired

    describe("When decode token fails", () => {
      before(() => {
        sinon.stub(encrypter, "decodeToken").rejects()
      })

      it("should reject", () => {
        return expect(func("access", "token")).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When decode token succedes", () => {
      before(() => {
        sinon.stub(encrypter, "decodeToken").resolves({ expire: new Date(new Date().getTime() - 10000) } as UserPayload)
      })

      it("should fulfil", () => {
        return expect(func("access", "token")).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })

  describe("getLoggedUser function test", () => {
    const func = getLoggedUser
    const user = getFakeUsers(1)[0]

    describe("When GetUserById fails", () => {
      before(() => {
        sinon.stub(userController, "GetUserById").rejects()
      })

      it("should reject", () => {
        return expect(func({ _id: user._id, email: user.email, role: user.role })).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When GetUserById succedes", () => {
      before(() => {
        sinon.stub(userController, "GetUserById").resolves(user)
      })

      it("should fulfil", () => {
        return expect(func({ _id: user._id, email: user.email, role: user.role })).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })
})
