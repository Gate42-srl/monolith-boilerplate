import React, { useEffect } from "react"
import { connect } from "react-redux"
import { INotification } from "../types/interfaces"

import Notifications from "react-notifications-menu"
import { w3cwebsocket as W3CWebSocket } from "websocket"

const data: any[] = []

const NotificationModal = ({ auth }: INotification) => {
  useEffect(() => {
    if (auth && auth.isAuthenticated) {
      const client = new W3CWebSocket("ws://localhost:5000/requestSocket")

      client.onopen = () => {
        console.log(`WebSocket Client Connected`)

        if (auth.user) client.send(JSON.stringify({ userId: auth.user._id }))
      }

      client.onmessage = (message: any) => {
        switch (JSON.parse(message.data).type) {
          case "test":
            data.push({
              image:
                "https://www.freepnglogos.com/uploads/dot-png/dot-popular-science-monthly-volume-may-illusions-37.png",
              message: JSON.parse(message.data).data,
              receivedTime: getNotificationReceivedTime(),
            })
            break
          default:
            console.log(JSON.parse(message.data))
        }
      }
    }
  }, [auth])

  return (
    <Notifications
      header={{
        title: "Notifications",
        option: {
          text: "Mark as all read",
          onClick: () => {
            data.length = 0
          },
        },
      }}
      data={data}
    />
  )
}

const mapToProps = (state: INotification) => ({
  auth: state.auth,
})

const getNotificationReceivedTime = () => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return `${new Date().getDate().toString()} ${monthNames[new Date().getMonth()].toString()} ${new Date()
    .getFullYear()
    .toString()} ${new Date().getHours().toString()}:${new Date().getMinutes().toString()}`
}

export default connect(mapToProps)(NotificationModal)
