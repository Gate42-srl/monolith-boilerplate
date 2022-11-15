import React, { useEffect } from "react"
import AppNavbar from "./components/AppNavbar"
import PlaceHolderModal from "./components/PlaceHolderModal"
import { Container } from "reactstrap"

import { Provider } from "react-redux"
import store from "./flux/store"
import { loadUser, refreshToken } from "./flux/actions/authActions"

import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

const App = () => {
  useEffect(() => {
    store.dispatch(refreshToken())
  }, [])

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <div className="App">
        <AppNavbar />
        <Container>
          <PlaceHolderModal />
        </Container>
      </div>
    </Provider>
  )
}

export default App
