import "mocha"
import chai from "chai"
import sinon from "sinon"
import chaiAsPromised from "chai-as-promised"

const expect = chai.expect
chai.use(chaiAsPromised)

import * as userController from "../../controllers/userController"
import { dbCheck } from "../../databases/dbCheck"

import { faker } from "@faker-js/faker"
import mongoose from "mongoose"

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

describe.skip("db check test", () => {
  describe("When getAllUsers fails", () => {
    before(() => {
      sinon.stub(userController, "GetAllUsers").rejects()
    })

    it("should reject", () => {
      return expect(dbCheck()).to.be.eventually.rejected
    })

    after(() => {
      sinon.restore()
    })
  })

  describe("When getAllUsers succedes", () => {
    describe("When CreateUser fails", () => {
      before(() => {
        sinon.stub(userController, "GetAllUsers").resolves([])
        sinon.stub(userController, "CreateUser").rejects()
      })

      it("should reject", () => {
        return expect(dbCheck()).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When CreateUser succedes", () => {
      before(() => {
        sinon.stub(userController, "GetAllUsers").resolves([])
        sinon.stub(userController, "CreateUser").resolves(getFakeUsers(1)[0])
      })

      it("should fulfil", () => {
        return expect(dbCheck()).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })
})
