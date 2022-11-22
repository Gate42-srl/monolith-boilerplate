import "mocha"
import chai from "chai"
import sinon from "sinon"
import chaiAsPromised from "chai-as-promised"

const expect = chai.expect
chai.use(chaiAsPromised)

import { hashPassword, comparePassword, generateJwt, decodeToken } from "../../utils/encryption"

import { faker } from "@faker-js/faker"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
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

describe("ecryption utility tests", () => {
  describe("hashPassword function test", () => {
    const func = hashPassword
    const password = faker.internet.password()

    describe("When hash fails", () => {
      before(() => {
        sinon.stub(bcrypt, "hash").rejects()
      })

      it("should reject", () => {
        return expect(func(password)).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When hash succedes", () => {
      before(async () => {
        sinon.stub(bcrypt, "hash").resolves(await bcrypt.hash(password, 10))
      })

      it("should fulfil", () => {
        return expect(func(password)).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })

  describe("comparePassword function test", () => {
    const func = comparePassword
    const password = faker.internet.password()

    describe("When hash fails", () => {
      before(() => {
        sinon.stub(bcrypt, "compare").rejects()
      })

      it("should reject", async () => {
        return expect(func(password, await bcrypt.hash(password, 10))).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When hash succedes", () => {
      before(() => {
        sinon.stub(bcrypt, "compare").resolves(true)
      })

      it("should fulfil", async () => {
        return expect(func(password, await bcrypt.hash(password, 10))).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })

  describe("generateJwt function test", () => {
    const func = generateJwt
    const user = getFakeUsers(1)[0]

    describe("When type is valid", () => {
      describe("When jtw sign fails", () => {
        before(() => {
          sinon.stub(jwt, "sign").rejects()
        })

        it("should reject", () => {
          return expect(func("access", { _id: user._id, email: user.email, role: user.role })).to.be.rejected
        })

        after(() => {
          sinon.restore()
        })
      })

      describe("When jtw sign succedes", () => {
        before(() => {
          sinon.stub(jwt, "sign").resolves("token")
        })

        it("should fulfil", () => {
          return expect(func("access", { _id: user._id, email: user.email, role: user.role })).to.be.fulfilled
        })

        after(() => {
          sinon.restore()
        })
      })
    })

    describe("When type is not valid", () => {
      before(() => {})

      it("should return null", () => {
        return expect(func("invalid type", { _id: user._id, email: user.email, role: user.role })).to.be.equal(null)
      })

      after(() => {})
    })
  })

  describe("decodeToken function test", () => {
    const func = decodeToken
    const user = getFakeUsers(1)[0]

    describe("When jtw verify fails", () => {
      before(() => {
        sinon.stub(jwt, "verify").rejects()
      })

      it("should reject", () => {
        return expect(func("access", "token")).to.be.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When jtw verify succedes", () => {
      before(() => {
        sinon.stub(jwt, "verify").resolves("decoded token")
      })

      it("should fulfil", () => {
        return expect(func("access", "token")).to.be.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })
})
