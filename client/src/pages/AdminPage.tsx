// React imports
import React, { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { connect } from "react-redux"

// Components imports
import UsersTable from "../components/UsersTable"

// Types imports
import { IAuthReduxProps } from "../types/interfaces"

// ANTD imports
import { Space } from "antd"

// CSS imports
import "../components/css/Table.css"

const AdminPage = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  // navigation hooks
  const navigate = useNavigate()
  const prevLocation = useLocation()

  // function to redirect an authenticated user when page is refreshed
  useEffect(() => {
    if (!isAuthenticated) navigate(`/login/?redirectTo=${prevLocation.pathname}${prevLocation.search}`)
  }, [isAuthenticated, prevLocation, navigate])

  return (
    <div>
      <Space>
        <h4 className="userListText">{"Users"}</h4>
      </Space>
      <UsersTable></UsersTable>
    </div>
  )
}

const mapToProps = (state: IAuthReduxProps) => ({
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapToProps)(AdminPage)
