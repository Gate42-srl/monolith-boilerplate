import React, { useState, useCallback, useEffect } from "react"
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert } from "reactstrap"
import { connect } from "react-redux"
import { register } from "../../flux/actions/authActions"
import { clearErrors } from "../../flux/actions/errorActions"
import { IRegisterModal, ITarget, IAuthReduxProps } from "../../types/interfaces"

const RegisterModal = ({ isAuthenticated, error, register, clearErrors }: IRegisterModal) => {
  const [modal, setModal] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstname, setFirstName] = useState("")
  const [lastname, setLastName] = useState("")
  const [msg, setMsg] = useState(null)

  const handleToggle = useCallback(() => {
    // Clear errors
    clearErrors()
    setModal(!modal)
  }, [clearErrors, modal])

  const handleChangeEmail = (e: ITarget) => setEmail(e.target.value)
  const handleChangePassword = (e: ITarget) => setPassword(e.target.value)
  const handleChangeFirstName = (e: ITarget) => setFirstName(e.target.value)
  const handleChangeLastName = (e: ITarget) => setLastName(e.target.value)

  const handleOnSubmit = (e: any) => {
    e.preventDefault()

    // Create user object
    const user = {
      email,
      password,
      firstname,
      lastname,
    }

    // Attempt to login
    register(user)
  }

  useEffect(() => {
    // Check for register error
    if (error.id === "REGISTER_FAIL") {
      setMsg(error.msg.msg)
    } else {
      setMsg(null)
    }

    // If authenticated, close modal
    if (modal) {
      if (isAuthenticated) {
        handleToggle()
      }
    }
  }, [error, handleToggle, isAuthenticated, modal])

  return (
    <div>
      <NavLink onClick={handleToggle} href="#">
        Register
      </NavLink>

      <Modal isOpen={modal} toggle={handleToggle}>
        <ModalHeader toggle={handleToggle}>Register</ModalHeader>
        <ModalBody>
          {msg ? <Alert color="danger">{msg}</Alert> : null}
          <Form onSubmit={handleOnSubmit}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="mb-3"
                onChange={handleChangeEmail}
              />

              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="mb-3"
                onChange={handleChangePassword}
              />

              <Label for="firstName">Name</Label>
              <Input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First name"
                className="mb-3"
                onChange={handleChangeFirstName}
              />

              <Label for="lastName">Last name</Label>
              <Input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last name"
                className="mb-3"
                onChange={handleChangeLastName}
              />
              <Button color="dark" style={{ marginTop: "2rem" }} block>
                Register
              </Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}

const mapStateToProps = (state: IAuthReduxProps) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
})

export default connect(mapStateToProps, { register, clearErrors })(RegisterModal)
