// React imports
import React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { connect } from "react-redux"

// types
import { IAuthReduxProps } from "../types/interfaces"

// Login logic import
import { logout } from "../flux/actions/authActions"

// ANTD
import { Button } from "antd"

// CSS and image
import Logo from "../assets/img/logo.png"
import "./css/AppNavbar.css"

const AppNavbar = ({ auth, logout }: any) => {
  // Navigation hooks
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div>
      <header
        className="navbar"
        style={{
          visibility: location.pathname === "/admin/" || location.pathname === "/admin" ? "visible" : "hidden",
        }}
      >
        <img src={"../static/media/logo.606557edb3f2a4dbb668.png" || Logo} alt="logo" className="Logo"></img>
        <nav className="navlist">
          <ul className="list">
            <li className="role">{"Admin"}</li>
          </ul>
        </nav>
        <Button
          type="ghost"
          shape="round"
          className="logoutButton"
          onClick={() => {
            logout()
            navigate("/login/")
          }}
        >
          Logout
        </Button>
      </header>
    </div>
  )
}

const mapStateToProps = (state: IAuthReduxProps) => ({
  auth: state.auth,
})

export default connect(mapStateToProps, { logout })(AppNavbar)
