import React, { Fragment, useEffect, useState } from "react"
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Container } from "reactstrap"
import { connect } from "react-redux"
import { IAppNavbar, IAuthReduxProps } from "../types/interfaces"

import RegisterModal from "./auth/RegisterModal"
import LoginModal from "./auth/LoginModal"
import Logout from "./auth/Logout"
import NotificationModal from "./NotificationModal"

// import { w3cwebsocket as W3CWebSocket } from "websocket"

const AppNavbar = ({ auth }: IAppNavbar) => {
  /*useEffect(() => {
    if (auth && auth.isAuthenticated) {
      const client = new W3CWebSocket("ws://localhost:5000/requestSocket")

      client.onopen = () => {
        console.log(`WebSocket Client Connected`)

        if (auth.user) client.send(JSON.stringify({ userId: auth.user._id }))
        else client.send(JSON.stringify({}))
      }

      client.onmessage = (message: any) => {
        switch (message.data.type) {
          case "test":
            console.log("got reply! ", JSON.parse(message.data))
            break
          default:
            console.log(JSON.parse(message.data))
        }
      }
    }
  }, [auth])*/

  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => setIsOpen(!isOpen)

  const authLinks = (
    <Fragment>
      <NavItem>
        <span className="navbar-text mr-3">
          <strong>{auth && auth.user ? `Welcome ${auth.user.firstname}` : ""}</strong>
        </span>
      </NavItem>
      <NavItem>
        <Logout />
      </NavItem>
      <NavItem>
        <NotificationModal />
      </NavItem>
    </Fragment>
  )

  const guestLinks = (
    <Fragment>
      <NavItem>
        <RegisterModal />
      </NavItem>
      <NavItem>
        <LoginModal />
      </NavItem>
    </Fragment>
  )

  return (
    <div>
      <Navbar color="dark" dark expand="sm" className="mb-5">
        <Container>
          <NavbarBrand href="/">Voice Office</NavbarBrand>
          <NavbarToggler onClick={handleToggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {auth && auth.isAuthenticated ? authLinks : guestLinks}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

const mapStateToProps = (state: IAuthReduxProps) => ({
  auth: state.auth,
})

export default connect(mapStateToProps, null)(AppNavbar)
