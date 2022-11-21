import "mocha"
import chai from "chai"
import sinon from "sinon"
import chaiAsPromised from "chai-as-promised"

const expect = chai.expect
chai.use(chaiAsPromised)

import { errorHandler } from "../../middlewares/errors"
import { getMockedRequest, getMockedResponse } from "../utils"

describe.skip("errors middleware test", () => {
  let mockedRequest: any
  let mockedResponse: any

  describe("When error is instance of Error", () => {
    const error: Error = new Error(JSON.stringify("error message"))

    before(() => {
      mockedRequest = getMockedRequest()
      mockedResponse = getMockedResponse()
    })

    it("should catch", async () => {
      return expect(errorHandler(error, mockedRequest, mockedResponse)).has.throw
    })

    after(() => {
      sinon.restore()
    })
  })

  describe("When error is not instance of Error", () => {
    const error: any = { name: "error name", message: "error message", stack: "error stack" }

    before(() => {
      mockedRequest = getMockedRequest()
      mockedResponse = getMockedResponse()
    })

    it("should return built error", async () => {
      expect(errorHandler(error, mockedRequest, mockedResponse).status).to.be.equal("error")
      expect(errorHandler(error, mockedRequest, mockedResponse).error.name).to.be.equal(error.name)
      expect(errorHandler(error, mockedRequest, mockedResponse).error.message).to.be.equal(error.message)
      expect(errorHandler(error, mockedRequest, mockedResponse).error.stack).to.be.equal(error.stack)
      expect(errorHandler(error, mockedRequest, mockedResponse).msg).to.be.equal(error.message)
      expect(errorHandler(error, mockedRequest, mockedResponse).statusCode).to.be.equal(500)
    })

    after(() => {
      sinon.restore()
    })
  })
})
