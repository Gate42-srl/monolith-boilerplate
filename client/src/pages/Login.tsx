// React components
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { connect } from "react-redux"

// Query string library for redirect
import queryString from "query-string"

// Ant Design imports
import { Button, Alert, Form, Input } from "antd"

// Login import logics
import { login } from "../flux/actions/authActions"
import { clearErrors } from "../flux/actions/errorActions"
import { IAuthReduxProps, ILogin, ITarget } from "../types/interfaces"

// CSS and image
import Logo from "../assets/img/logo.png"

const { Password } = Input as any

const Login = ({ isAuthenticated, error, login, clearErrors }: ILogin) => {
  // navigation hooks
  const navigate = useNavigate()
  const location = useLocation()

  // Sets hook for email, password, loading state and possible errore messages
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  const [loadings, setLoadings] = useState([] as boolean[])

  useEffect(() => {
    // If the user is authenticated redirect them to the admin page
    if (isAuthenticated && localStorage.getItem("userRole") === "admin") navigate("/admin/")

    // Query params
    const { redirectTo, token } = queryString.parse(location.search) as { redirectTo: string; token: string }

    // Redirects to specified page
    if (token) navigate(redirectTo == null ? "/login/" : `${redirectTo}?token=${token}`)
    else navigate(redirectTo == null ? "/login/" : redirectTo)
  }, [isAuthenticated, navigate, location])

  // Sets loading state for log in button preventing sending multiple submit
  const enterLoading = (index: any) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings]
        newLoadings[index] = false
        return newLoadings
      })
    }, 6000)
  }

  // function to set email and password when they're inserted into the form
  const handleChangeEmail = (e: ITarget) => setEmail(e.target.value)
  const handleChangePassword = (e: ITarget) => setPassword(e.target.value)

  // function to handle when form fields are filled and submitted
  const handleOnSubmit = async (e: any) => {
    enterLoading(0)

    // Clears previous error, setting the msg to null and throwing clearErrors action that resets error state
    setMsg("")
    clearErrors()

    e.preventDefault()

    const user = { email, password }

    // Attempt to login, using the action
    await login(user)

    navigate("/admin/")
  }

  useEffect(() => {
    // Check for login error and eventually sets the message to display it. Otherwise, it sets the msg to null.
    if (error.id === "LOGIN_FAIL") setMsg(error.msg)
    else setMsg("")
  }, [error, setMsg])

  return (
    <div style={{ backgroundColor: "#818181", textAlign: "center" }}>
      {msg ? (
        <Alert
          message={msg}
          type="error"
          style={{ marginTop: "-90px", marginBottom: "50px", backgroundColor: "#ec2222", borderColor: "black" }}
        />
      ) : null}

      <Form
        initialValues={{
          remember: true,
        }}
        autoComplete="off"
        style={{ width: "60%", margin: "auto", marginRight: "240px" }}
      >
        <div>
          <img
            src={"../static/media/logo.606557edb3f2a4dbb668.png" || Logo}
            alt="logo"
            style={{ height: "200px", textAlign: "center", marginLeft: "-90px", marginTop: "-20px" }}
          ></img>
          <h4
            style={{
              fontSize: "40px",
              fontFamily: "Verdana",
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              marginTop: "-50px",
              marginBottom: "50px",
            }}
          >
            Admin
          </h4>
        </div>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Please input your email.",
            },
          ]}
        >
          <Input placeholder="Email" onChange={handleChangeEmail} style={{ padding: 6, borderRadius: "10px" }} />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Please input your password.",
            },
          ]}
        >
          <Password
            placeholder="Password"
            onChange={handleChangePassword}
            style={{ padding: 6, borderRadius: "10px" }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="ghost"
            htmlType="submit"
            loading={loadings[0]}
            onClick={handleOnSubmit}
            style={{ backgroundColor: "white", color: "#818181" }}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const mapStateToProps = (state: IAuthReduxProps) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
})

export default connect(mapStateToProps, { login, clearErrors })(Login)
