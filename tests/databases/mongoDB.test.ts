import "mocha"
import chai from "chai"
import sinon from "sinon"
import chaiAsPromised from "chai-as-promised"

const expect = chai.expect
chai.use(chaiAsPromised)

import * as dbCheck from "../../databases/dbCheck"
import { connectToMongoDB } from "../../databases/MongoDB"
import mongoose from "mongoose"

describe("MongoDB database connection test", () => {
  describe("When mongoose connect fails", () => {
    before(() => {
      sinon.stub(mongoose, "connect").rejects()
    })

    it("should reject", () => {
      return expect(connectToMongoDB()).to.be.eventually.rejected
    })

    after(() => {
      sinon.restore()
    })
  })

  describe("When mongoose connect succedes", () => {
    describe("When dbCheckfails fails", () => {
      before(() => {
        sinon.stub(mongoose, "connect").resolves()
        sinon.stub(dbCheck, "dbCheck").rejects()
      })

      it("should reject", () => {
        return expect(connectToMongoDB()).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When dbCheckfails succedes", () => {
      before(() => {
        sinon.stub(mongoose, "connect").resolves()
        sinon.stub(dbCheck, "dbCheck").resolves()
      })

      it("should fulfil", () => {
        return expect(connectToMongoDB()).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })
})
