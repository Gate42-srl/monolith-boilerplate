import axios from "axios"
import { returnErrors } from "./errorActions"
import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  REFRESH_SUCCESS,
} from "./types"
import { IAuthFunction, IConfigHeaders } from "../../types/interfaces"
import ConfigData from "../../config/config.json"

// Check token & load user
export const loadUser = () => async (dispatch: Function, getState: Function) => {
  // User loading
  dispatch({ type: USER_LOADING })

  axios
    .get(`${ConfigData.BACKEND_URL}/auth/user`, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status))
      dispatch({
        type: AUTH_ERROR,
      })
    })
}

// Refresh token if it is expired
export const refreshToken = () => async (dispatch: Function, getState: Function) => {
  axios
    .post(`${ConfigData.BACKEND_URL}/auth/token`, {}, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: REFRESH_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status))
      dispatch({
        type: AUTH_ERROR,
      })
    })
}

// Register User
export const register =
  ({ email, password, firstname, lastname }: IAuthFunction) =>
  (dispatch: Function) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    // Request body
    const body = JSON.stringify({ email, password, firstname, lastname })

    axios
      .post(`${ConfigData.BACKEND_URL}/auth/signup`, body, config)
      .then((res) =>
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data,
        })
      )
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status, "REGISTER_FAIL"))
        dispatch({
          type: REGISTER_FAIL,
        })
      })
  }

// Login User
export const login =
  ({ email, password }: IAuthFunction) =>
  (dispatch: Function) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    // Request body
    const body = JSON.stringify({ email, password })

    axios
      .post(`${ConfigData.BACKEND_URL}/auth/login`, body, config)
      .then((res) =>
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data,
        })
      )
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status, "LOGIN_FAIL"))
        dispatch({
          type: LOGIN_FAIL,
        })
      })
  }

// Logout User
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS,
  }
}

// Setup config/headers and token
export const tokenConfig = (getState: Function) => {
  // Get token from localstorage
  const token = getState().auth.token
  const refreshToken = getState().auth.refreshToken

  // Headers
  const config: IConfigHeaders = {
    headers: {
      "Content-type": "application/json",
    },
  }

  // If token, add to headers
  if (token && refreshToken) {
    config.headers.authorization = token
    config.headers.refresh = refreshToken
  }

  return config
}
