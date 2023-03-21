// External modules
import React, { useEffect } from "react"
import { Container } from "reactstrap"
import { Provider } from "react-redux"
import { Route, Routes } from "react-router-dom"

// Components
import AppNavbar from "./components/AppNavbar"

// Pages
import Login from "./pages/Login"
import AdminPage from "./pages/AdminPage"
import PasswordReset from "./pages/PasswordReset"

// auth imports
import store from "./flux/store"
import { loadUser, refreshToken } from "./flux/actions/authActions"

// css
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

const App = () => {
  useEffect(() => {
    if (store.getState().auth.refreshToken) store.dispatch(refreshToken())
  }, [])

  useEffect(() => {
    if (store.getState().auth.token) store.dispatch(loadUser())
  }, [])

  return (
    <div className="App" style={{ backgroundColor: "#818181" }}>
      <Provider store={store}>
        <div>
          <AppNavbar></AppNavbar>
          <Container>
            <Routes>
              <Route path="/" element={<Login />}></Route>
              <Route path="/login/*" element={<Login />}></Route>
              <Route path="/admin/*" element={<AdminPage />}></Route>
              <Route path="/passwordReset/*" element={<PasswordReset />}></Route>
            </Routes>
          </Container>
        </div>
      </Provider>
    </div>
  )
}

export default App
