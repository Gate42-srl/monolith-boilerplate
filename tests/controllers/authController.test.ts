import "mocha"
import chai from "chai"
import sinon from "sinon"
import chaiAsPromised from "chai-as-promised"

const expect = chai.expect
chai.use(chaiAsPromised)

import {
  CreateRefreshToken,
  DeleteRefreshTokenFromToken,
  GetRefreshTokenFromToken,
  GetRefreshTokenFromUserId,
} from "../../controllers/authController"

import { faker } from "@faker-js/faker"
import mongoose from "mongoose"
import { refreshTokenModel } from "../../models"
import * as PostgreSQL from "../../databases/PostgreSQL"
import { encrypter } from "../../utils"

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

describe("Auth controller tests", () => {
  describe("Test GetRefreshTokenFromUserId", () => {
    const refreshToken = getFakeRefreshToken()

    describe("When find one or query fails", () => {
      before(() => {
        sinon.stub(refreshTokenModel, "findOne").rejects()
        sinon.stub(PostgreSQL.pool, "query").rejects()
      })

      it("should reject", () => {
        return expect(GetRefreshTokenFromUserId(refreshToken.userId.toString())).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When find one or query succedes", () => {
      before(() => {
        sinon.stub(refreshTokenModel, "findOne").resolves(refreshToken)
        sinon.stub(PostgreSQL.pool, "query").resolves({ rows: [refreshToken] })
      })

      it("should fulfil", () => {
        return expect(GetRefreshTokenFromUserId(refreshToken.userId.toString())).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })

  describe("Test GetRefreshTokenFromToken", () => {
    const refreshToken = getFakeRefreshToken() as { token: string; userId: mongoose.Types.ObjectId }

    describe("When find one or query fails", () => {
      before(() => {
        sinon.stub(refreshTokenModel, "findOne").rejects()
        sinon.stub(PostgreSQL.pool, "query").rejects()
      })

      it("should reject", () => {
        return expect(GetRefreshTokenFromToken(refreshToken.token)).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When find one or query succedes", () => {
      before(() => {
        sinon.stub(refreshTokenModel, "findOne").resolves(refreshToken)
        sinon.stub(PostgreSQL.pool, "query").resolves({ rows: [refreshToken] })
      })

      it("should fulfil", () => {
        return expect(GetRefreshTokenFromToken(refreshToken.token)).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })

  describe("Test CreateRefreshToken", () => {
    const refreshToken = getFakeRefreshToken() as { token: string; userId: mongoose.Types.ObjectId }

    describe("When save or postgres create fails", () => {
      before(() => {
        sinon.stub(refreshTokenModel.prototype, "save").rejects()
        sinon.stub(PostgreSQL, "Create").rejects()
      })

      it("should reject", () => {
        return expect(CreateRefreshToken(refreshToken)).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When save or postgres create succedes", () => {
      before(() => {
        sinon.stub(refreshTokenModel.prototype, "save").resolves(refreshToken)
        sinon.stub(PostgreSQL, "Create").resolves({ rows: [refreshToken] })
      })

      it("should fulfil", () => {
        return expect(CreateRefreshToken(refreshToken)).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })

  describe("Test DeleteRefreshTokenFromToken", () => {
    const refreshToken = getFakeRefreshToken() as { token: string; userId: mongoose.Types.ObjectId }

    describe("When find one and delete or query fails", () => {
      before(() => {
        sinon.stub(refreshTokenModel, "findOneAndDelete").rejects()
        sinon.stub(PostgreSQL.pool, "query").rejects()
      })

      it("should reject", () => {
        return expect(DeleteRefreshTokenFromToken(refreshToken.token)).to.be.eventually.rejected
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When find one and delete or query succedes", () => {
      before(() => {
        sinon.stub(refreshTokenModel, "findOneAndDelete").resolves(refreshToken)
        sinon.stub(PostgreSQL.pool, "query").resolves({ rows: [refreshToken] })
      })

      it("should fulfil", () => {
        return expect(DeleteRefreshTokenFromToken(refreshToken.token)).to.be.eventually.fulfilled
      })

      after(() => {
        sinon.restore()
      })
    })
  })
})
