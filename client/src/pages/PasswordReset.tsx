// React components
import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

// Query string library for redirect
import queryString from "query-string"

// Components imports
import PasswordResetForm from "../components/PasswordResetForm"

const PasswordReset = () => {
  // navigation hooks
  const location = useLocation()

  // token hook
  const [token, setToken] = useState("")

  useEffect(() => {
    setToken(queryString.parse(location.search).token as string)
  }, [setToken, location])

  return <PasswordResetForm token={token}></PasswordResetForm>
}

export default PasswordReset
