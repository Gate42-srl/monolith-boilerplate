import { E_ERROR } from "./enum"

// REACT
export interface ITarget {
  target: {
    value: React.SetStateAction<string>
  }
  preventDefault(): void
}

// ERRORS
export interface IMsg {
  msg: string | any
}

// AUTH
export interface IUser {
  email: string
  password: string
  firstname?: string
  lastname?: string
}

export interface IAuthForm {
  isAuthenticated?: boolean
  error: IError
  clearErrors(): void
}

export interface ILoginModal extends IAuthForm {
  login(user: IUser): void
}

export interface IRegisterModal extends IAuthForm {
  register(user: IUser): void
}

export interface ILogoutProps {
  logout(): void
}

export interface IError {
  id: E_ERROR
  msg: IMsg
}

export interface IAuthReduxProps {
  auth: { isAuthenticated: boolean }
  error: IError
}

export interface IConfigHeaders {
  headers: {
    [index: string]: string
  }
}

// NAVBAR
export interface IAppNavbar {
  auth?: {
    isAuthenticated: boolean
    user: IUser
  }
}

// <<<<<<<<<<<>>>>>>>>>>>>
// <<<<<<<< FLUX >>>>>>>>>
// <<<<<<<<<<<>>>>>>>>>>>>

export interface IAuthFunction {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface IReturnErrors {
  msg: {
    msg: string | any
  }
  status: string
  id: any
}

export interface IAction {
  type: string
  payload?: any
}
