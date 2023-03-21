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
} from "../actions/types"

const initialState = {
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: false,
  isLoading: false,
  user: null,
}

export default function authReducer(state = initialState, action: any) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      }
    case USER_LOADED:
      localStorage.setItem("userRole", action.payload.role)
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      }
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
    case REFRESH_SUCCESS:
      localStorage.setItem("token", action.payload.token)
      localStorage.setItem("refreshToken", action.payload.refreshToken)
      localStorage.setItem("userRole", action.payload.user.role)
      if (action.payload.user.role === "admin")
        return {
          ...state,
          ...action.payload,
          isAuthenticated: true,
          isLoading: false,
        }
      else
        return {
          ...state,
          ...action.payload,
          isAuthenticated: false,
          isLoading: false,
        }
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("userRole")
      return {
        ...state,
        token: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    default:
      return state
  }
}
