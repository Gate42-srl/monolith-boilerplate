import "mocha"
import chai from "chai"
import sinon from "sinon"
import chaiAsPromised from "chai-as-promised"

const expect = chai.expect
chai.use(chaiAsPromised)

import {
  GetUserById,
  GetAllUsers,
  GetUserByEmail,
  CreateUser,
  UpdateUser,
  DeleteUser,
} from "../../controllers/userController"

import { faker } from "@faker-js/faker"
import mongoose from "mongoose"
import { UserModel } from "../../models"
import * as PostgreSQL from "../../databases/PostgreSQL"

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

describe("User controller tests", () => {
  describe("Test GetUserById", () => {
    const user = getFakeUsers(1)[0]

    describe("When find by id or query fails", () => {
      before(() => {
        sinon.stub(UserModel, "findById").rejects()
        sinon.stub(PostgreSQL, "GetById").rejects()
      })

      it("should reject", () => {
        return expect(GetUserById(user._id.toString())).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When find by id or query succedes", () => {
      before(() => {
        sinon.stub(UserModel, "findById").resolves(user)
        sinon.stub(PostgreSQL, "GetById").resolves(user)
      })

      it("should fulfil", () => {
        return expect(GetUserById(user._id.toString())).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })

  describe("Test GetAllUsers", () => {
    describe("When find or getAll fails", () => {
      before(() => {
        sinon.stub(UserModel, "find").rejects()
        sinon.stub(PostgreSQL, "GetAll").rejects()
      })

      it("should reject", () => {
        return expect(GetAllUsers()).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When find or getAll succedes", () => {
      before(() => {
        sinon.stub(UserModel, "find").resolves(getFakeUsers(3))
        sinon.stub(PostgreSQL, "GetAll").resolves(getFakeUsers(3))
      })

      it("should fulfil", () => {
        return expect(GetAllUsers()).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })

  describe("Test GetUserByEmail", () => {
    const user = getFakeUsers(1)[0]

    describe("When find one or query fails", () => {
      before(() => {
        sinon.stub(UserModel, "findOne").rejects()
        sinon.stub(PostgreSQL.pool, "query").rejects()
      })

      it("should reject", () => {
        return expect(GetUserByEmail(user.email)).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When find one or query succedes", () => {
      before(() => {
        sinon.stub(UserModel, "findOne").resolves(user)
        sinon.stub(PostgreSQL.pool, "query").resolves({ rows: [user] })
      })

      it("should fulfil", () => {
        return expect(GetUserByEmail(user.email)).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })

  describe("Test CreateUser", () => {
    const user = getFakeUsers(1)[0]

    describe("When save or postgres create fails", () => {
      before(() => {
        sinon.stub(UserModel.prototype, "save").rejects()
        sinon.stub(PostgreSQL, "Create").rejects()
      })

      it("should reject", () => {
        return expect(CreateUser(user)).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When save or postgres create succedes", () => {
      before(() => {
        sinon.stub(UserModel.prototype, "save").resolves(user)
        sinon.stub(PostgreSQL, "Create").resolves(user)
      })

      it("should fulfil", () => {
        return expect(CreateUser(user)).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })

  describe("Test UpdateUser", () => {
    const user = getFakeUsers(1)[0]

    describe("When find by id and update or postgres update fails", () => {
      before(() => {
        sinon.stub(UserModel, "findByIdAndUpdate").rejects()
        sinon.stub(PostgreSQL, "Update").rejects()
      })

      it("should reject", () => {
        return expect(UpdateUser(user, user._id)).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When find by id and update or postgres update succedes", () => {
      before(() => {
        sinon.stub(UserModel, "findByIdAndUpdate").resolves(user)
        sinon.stub(PostgreSQL, "Update").resolves(user)
      })

      it("should fulfil", () => {
        return expect(UpdateUser(user, user._id)).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })

  describe("Test DeleteUser", () => {
    const user = getFakeUsers(1)[0]

    describe("When find by id and delete or postgres delete fails", () => {
      before(() => {
        sinon.stub(UserModel, "findByIdAndDelete").rejects()
        sinon.stub(PostgreSQL, "Delete").rejects()
      })

      it("should reject", () => {
        return expect(DeleteUser(user._id.toString())).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When find by id and delete or postgres delete succedes", () => {
      before(() => {
        sinon.stub(UserModel, "findByIdAndDelete").resolves(user)
        sinon.stub(PostgreSQL, "Delete").resolves(user)
      })

      it("should fulfil", () => {
        return expect(DeleteUser(user._id.toString())).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })
})
