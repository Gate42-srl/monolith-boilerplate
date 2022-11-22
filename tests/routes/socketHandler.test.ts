import "mocha"
import chai from "chai"
import sinon, { SinonSpy } from "sinon"
import chaiAsPromised from "chai-as-promised"

const expect = chai.expect
chai.use(chaiAsPromised)

import * as socketHandler from "../../routes/handlers/socketHandler"

import { getMockedRequest, getMockedResponse } from "../utils"

const getMockedConnection = () => {
  let connection
  return (connection = {
    socket: {
      send: function (message: string) {
        return message
      },
    },
  })
}

describe("Socket handler tests", () => {
  describe("Sandbox handler test", () => {
    let mockedRequest: any
    let mockedResponse: any
    const handler = socketHandler.sandboxHandler
    const clientId = `0000:${Math.random().toString(36).substring(2, 11)}`

    describe("When user is not admin", () => {
      before(() => {
        mockedRequest = getMockedRequest({
          user: { role: "user" },
        })
        mockedResponse = getMockedResponse()
      })

      it("should return 'Not authorized'", () => {
        return expect(handler(mockedRequest, mockedResponse)).to.be.equal("Not authorized")
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When client connected to the websocket", () => {
      before(() => {
        mockedRequest = getMockedRequest({
          user: { role: "admin" },
          body: { eventType: "test", userId: "0000", message: "testing message" },
        })
        mockedResponse = getMockedResponse()
      })

      it("should return 'Cannot find a client connected with the specified id'", () => {
        return expect(handler(mockedRequest, mockedResponse)).to.be.equal(
          "Cannot find a client connected with the specified id"
        )
      })

      after(() => {
        sinon.restore()
      })
    })

    describe("When notify runs", () => {
      let spy: SinonSpy

      before(() => {
        socketHandler.clients.push({ id: clientId, connection: getMockedConnection() })

        mockedRequest = getMockedRequest({
          user: { role: "admin" },
          body: { eventType: "test", userId: "0000", message: "testing message" },
        })
        mockedResponse = getMockedResponse()

        spy = sinon.spy(socketHandler.notify)
      })

      it("should call notify once", () => {
        return spy.calledOnce
      })

      it("should return built notification", () => {
        expect(handler(mockedRequest, mockedResponse).type).to.be.equal("test")
        expect(handler(mockedRequest, mockedResponse).data).to.be.equal("testing message")
      })

      after(() => {
        sinon.restore()
      })
    })
  })
})
