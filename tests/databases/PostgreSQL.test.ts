import "mocha"
import chai from "chai"
import sinon from "sinon"
import chaiAsPromised from "chai-as-promised"

const expect = chai.expect
chai.use(chaiAsPromised)

import * as dbCheck from "../../databases/dbCheck"
import * as PostgreSQL from "../../databases/PostgreSQL"
import mongoose from "mongoose"

describe("PostgreSQL database tests", () => {
  describe("ConnectToPostgreSQL test", () => {
    describe("When dbCheck fails", () => {
      before(() => {
        sinon.stub(dbCheck, "dbCheck").rejects()
      })

      it("should reject", () => {
        return expect(PostgreSQL.connectToPostgreSQL()).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When dbCheck succedes", () => {
      before(() => {
        sinon.stub(dbCheck, "dbCheck").resolves()
      })

      it("should fulfil", () => {
        return expect(PostgreSQL.connectToPostgreSQL()).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })

  describe("Postgres database GetById test", () => {
    const id = new mongoose.Types.ObjectId().toString()

    describe("When query fails", () => {
      before(() => {
        sinon.stub(PostgreSQL.pool, "query").rejects()
      })

      it("should reject", () => {
        return expect(PostgreSQL.GetById("table", id)).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When query succedes", () => {
      before(() => {
        sinon.stub(PostgreSQL.pool, "query").resolves({ rows: [{ key: "value" }] })
      })

      it("should fulfil", () => {
        return expect(PostgreSQL.GetById("table", id)).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })
})
