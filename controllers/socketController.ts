let clients: { id: string; connection: any }[] = []
let queueMessages: { userId: string; message: string }[] = []

// The amount of time to wait before pinging the clients again
const PING_TIMEOUT = 25000
// A default value to connect to the websocket for the user
const DEFAULT_USER_VALUE = "0000"

export function socketController(fastify: any, opts: any, done: any) {
  // Send a ping message to the client every PING_TIMEOUT milliseconds
  setInterval(pingClients, PING_TIMEOUT)

  fastify.get("/", { websocket: true }, (connection: any, req: any) => {
    // Handle new messages from the client
    connection.socket.on("message", (msg: string) => {
      // Retrieve the userId and structureId from the message payload
      const { userId } = JSON.parse(msg)

      // Generate a unique id for the client
      const clientUniqueId = Math.random().toString(36).substring(2, 11)

      // Create an unique id for the client composed by the userId and a random string
      const clientId = userId === undefined ? `${DEFAULT_USER_VALUE}:${clientUniqueId}` : `${userId}:${clientUniqueId}`

      // Store the client unique id in the connection
      connection.socket.id = clientId

      // Add the client to the clients list
      clients.push({ id: clientId, connection })

      // Check if there are pending messages for the user in the message queue
      let messages = queueMessagesCheck(userId)

      if (messages)
        messages.forEach((message) => {
          connection.socket.send(message)
          queueMessages = queueMessages.filter((messageToRemove) => messageToRemove.message !== message)
        })
    })

    // Handle pong event
    connection.socket.on("pong", () => {
      // Mark the socket as alive when we receive a pong
      connection.socket.isAlive = true
    })

    // Handle socket disconnection
    connection.socket.on("close", () => {
      // Retrieve the client unique id from the connection
      const clientId = connection.socket.id

      // Remove the client from the clients list
      removeClient(clientId)
    })
  })

  fastify.get("/clients", () => {
    // Return the clients list
    return clients.map((client) => client.id)
  })

  done()
}

/**
 * @function pingClients
 * @description Send a ping to all connected clients. If they are not connected, they will be removed from the clients list
 */
const pingClients = () => {
  clients.forEach(({ id, connection }) => {
    if (connection.socket.isAlive === false) {
      // Remove the client from the clients list
      removeClient(id)
      // Terminate the connection
      return connection.socket.terminate()
    }

    // Mark the socket as not alive until we get a pong
    connection.socket.isAlive = false
    // Send a ping
    connection.socket.ping()
  })
}

/**
 * @description Remove a client from the clients list
 * @param {string} clientId The client id to remove from the clients list
 */
const removeClient = (clientId: string) => {
  // Remove the client from the clients list
  clients = clients.filter((client) => client.id != clientId)
}

/**
 * @function notify
 * @description send a message to a specific client or add the message in queue list
 * @param {String} userId the id ot the user that had to receive the message
 * @param {String} structureId the id of the structure involved
 * @param {Object} message the message that we want to send to the client
 */
function notify(userId: string, message: string) {
  let clientsTosend: any[] = []

  // Create an unique id for the client composed by the userId and a random string
  const idPrefix = userId === undefined ? `${DEFAULT_USER_VALUE}:.*` : `${userId}:.*`

  if (clients.length > 0)
    clients.forEach((client) => {
      //adds the user and the front officer of the specific structure involved in the event to the list of clients to send a message to
      if (client.id.match(idPrefix)) clientsTosend.push(client)
    })

  if (clientsTosend.length > 0)
    clientsTosend.forEach((client) => {
      try {
        client.connection.socket.send(message)
      } catch (err) {
        queueMessages.push({ userId, message })
      }
    })
  else queueMessages.push({ userId, message })
}

function queueMessagesCheck(id: string) {
  let messages: string[] = []

  if (queueMessages.length > 0)
    queueMessages.forEach((queueMessage) => {
      if (queueMessage.userId == id) messages.push(queueMessage.message)
    })

  if (messages.length > 0) return messages
  else return null
}
