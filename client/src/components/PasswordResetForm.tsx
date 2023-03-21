// React components
import React, { useState } from "react"

// Types imports
import { ITarget } from "../types/interfaces"

// Services imports
import { changePassword } from "../services/users"

// Ant Design imports
import { Alert, Button, Card, Form, Input } from "antd"

// CSS and image
import Logo from "../assets/img/logo.png"
import "../components/css/PasswordResetForm.css"

const { Password } = Input as any

const PasswordResetForm = ({ token }: any) => {
  // password and errors hooks
  const [password, setPassword] = useState("")
  const [repeatPass, setRepeatedPass] = useState("")
  const [msg, setMsg] = useState("")

  // hooks that signal if the button is pressed
  const [buttonPressed, setPressed] = useState(false)

  // handle password
  const handleChangePassword = (e: ITarget) => setPassword(e.target.value)
  const handleChangeRepeatPassword = (e: ITarget) => setRepeatedPass(e.target.value)

  // function to handle when form fields are filled and submitted
  const handleOnSubmit = async (e: any) => {
    if (!password || !repeatPass) return setMsg("Digitare la nuova password")
    if (password !== repeatPass) return setMsg("Le password devono coincidere")

    // resets error message and form
    setMsg("")
    e.preventDefault()

    // Calls API that changes the password
    const result = await changePassword(token, { password })

    if (result === 400)
      return setMsg("La password deve contenere minimo 8 caratteri, una maiuscola, una minuscola ed almeno un numero")
    else if (result === 401) return setMsg("Richiesta scaduta. Si prega di riprovare.")

    // Changes card content
    setPressed(true)

    // Redirects user to FE login
    setInterval(() => window.location.replace("https://your-FE/login"), 1500) // CHANGE THIS TO YOUR FE LOGIN URL
  }

  return (
    <div>
      {msg ? (
        <Alert
          message={msg}
          type="error"
          style={{
            marginTop: "-90px",
            marginBottom: "85px",
            backgroundColor: "#ec2222",
            borderColor: "black",
            textAlign: "center",
          }}
        />
      ) : null}
      <Card className="passwordForm">
        <img src={Logo} alt="logo" className="passwordResetLogo"></img>
        {buttonPressed === false ? (
          <div>
            <strong className="passwordResetFormTitle">{"Recupero password"}</strong>
            <Form
              initialValues={{
                remember: true,
              }}
              autoComplete="off"
              style={{ width: "60%", margin: "auto", marginRight: "240px", marginTop: "70px" }}
            >
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Input new password",
                  },
                ]}
              >
                <Password
                  placeholder="Input new password"
                  onChange={handleChangePassword}
                  style={{ padding: 8, borderRadius: "0px", width: "165%", marginTop: "-30px" }}
                />
              </Form.Item>

              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Reapet new password",
                  },
                ]}
              >
                <Password
                  placeholder="Reapet new password"
                  onChange={handleChangeRepeatPassword}
                  style={{ padding: 8, borderRadius: "0px", width: "165%", marginTop: "-30px" }}
                />
              </Form.Item>

              <Form.Item>
                <Button type="ghost" htmlType="submit" onClick={handleOnSubmit} className="forwardButton">
                  <strong>{"Next"}</strong>
                </Button>
              </Form.Item>
            </Form>
          </div>
        ) : (
          <div>
            <strong className="passwordResetSuccessTitle">{"Password changed successfully!"}</strong>
            <p style={{ textAlign: "center", marginTop: "95px" }}>{"You're going to redirect to login page."}</p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default PasswordResetForm
