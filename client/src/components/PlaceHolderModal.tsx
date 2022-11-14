import React from "react"
import { connect } from "react-redux"
import { IAuthReduxProps } from "../types/interfaces"

const PlaceHolderModal = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <div>
      {isAuthenticated ? (
        <h4 className="mb-3 ml-4">You've succesfully logged in.</h4>
      ) : (
        <h4 className="mb-3 ml-4">Welcome to Voice Office, please log in.</h4>
      )}
    </div>
  )
}

const mapToProps = (state: IAuthReduxProps) => ({
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapToProps)(PlaceHolderModal)
