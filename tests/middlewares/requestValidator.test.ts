import "mocha"
import chai from "chai"
import sinon from "sinon"
import chaiAsPromised from "chai-as-promised"

const expect = chai.expect
chai.use(chaiAsPromised)

import { validateRequest } from "../../validation/RequestValidators/requestValidator"
import * as requestValidators from "../../validation/RequestValidators/schemaValidators"
import * as testUtils from "../utils"

describe("request validator middleware test", () => {
  let mockedRequest: any
  let mockedResponse: any

  describe("When request is valid", () => {
    before(() => {
      mockedRequest = testUtils.getMockedRequest({
        body: {
          key: "value",
        },
      })
      mockedResponse = testUtils.getMockedResponse()

      sinon.stub(testUtils, "validateFunction").returns(true)
    })

    it("should return undefined", async () => {
      return expect(
        await validateRequest("body", testUtils.validateFunction)(mockedRequest, mockedResponse)
      ).to.be.equal(undefined)
    })

    after(() => {
      sinon.restore()
    })
  })

  describe("When request is not valid", () => {
    before(() => {
      mockedRequest = testUtils.getMockedRequest({
        body: {
          key: "value",
        },
      })
      mockedResponse = testUtils.getMockedResponse()

      sinon.stub(testUtils, "validateFunction").returns(false)

      sinon.stub(requestValidators, "buildErrorMessage").returns("error message")
    })

    it("should return built error message", async () => {
      return expect(
        await validateRequest("body", testUtils.validateFunction)(mockedRequest, mockedResponse)
      ).to.be.equal("error message")
    })

    after(() => {
      sinon.restore()
    })
  })
})
