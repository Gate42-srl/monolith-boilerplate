// React imports
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"

// Types imports
import { IAuthReduxProps } from "../types/interfaces"

// Services imports
import { GetAllUsers, blockUnblockUser, deleteUser, adminFilter } from "../services/users"
import store from "../flux/store"

// ATND importns
import { Button, Col, Form, Modal, Space, Table } from "antd"

// CSS imports
import deleteIcon from "../assets/img/deleteOutlined.jpg"
import "./css/Table.css"

import TextArea from "antd/es/input/TextArea"

const UsersTable = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  // hook to set table parameters
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  })

  // function to handle pagination
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    })

    if (pagination.pageSize !== tableParams.pagination?.pageSize) setUsers([])
  }

  // hooks to set users
  const [users, setUsers] = useState([]) as any[]

  // Retrieves all users
  useEffect(() => {
    const getUsers = async () => {
      setUsers(await GetAllUsers(store.getState().auth.token, store.getState().auth.refreshToken))
    }

    if (isAuthenticated && localStorage.getItem("userRole") === "admin") getUsers()
  }, [setUsers, isAuthenticated])

  const [form] = Form.useForm() as any

  const switchButtonStyle = (status: string) => (status === "active" ? "blockButton" : "unblockButton")

  const handleBlockUser = async (userId: string) => {
    // Check to secure the admin doesn't block himself
    if (userId === store.getState().auth.user._id) {
      // allert
      window.alert("Cannot block an admin")
      return
    }

    // CALLS API TO BLOCK/UNBLOCK A USER
    const user = await blockUnblockUser(store.getState().auth.token, store.getState().auth.refreshToken, userId)

    if (user.state === "active") window.alert("User unblocked successfully")
    else window.alert("User blocked successfully")

    setUsers(await GetAllUsers(store.getState().auth.token, store.getState().auth.refreshToken))
  }

  // delete modal hooks
  const [isDeleteModalOpen, setDeleteModal] = useState(false)
  const [modalData, setModalData] = useState({ _id: "", firstname: null, lastname: null })

  // function to delete a user
  const handleDelete = async (userId: string) => {
    // Check to secure the admin doesn't delete himself
    if (userId === store.getState().auth.user._id) {
      // allert
      window.alert("Cannot delete an admin")
      return
    }

    // CALLS API TO DELETE USER
    await deleteUser(store.getState().auth.token, store.getState().auth.refreshToken, userId)

    // close modal
    setDeleteModal(false)

    // reset table
    setUsers(await GetAllUsers(store.getState().auth.token, store.getState().auth.refreshToken))

    // allert
    window.alert("User deleted")
  }

  const columns: any[] = [
    {
      title: "Name",
      key: "name",
      render: (payload: any) => {
        return `${payload.firstname} ${payload.lastname}`
      },
    },
    {
      title: "Email",
      key: "email",
      render: (payload: any) => {
        return `${payload.email}`
      },
    },
    {
      title: "Status",
      key: "status",
      filters: [
        { text: "active", value: "active" },
        { text: "not verified", value: "unVerified" },
        { text: "blocked", value: "blocked" },
      ],
      onFilter: (value: any, record: any) => record.status === value,
      render: (payload: any) => {
        return payload.status
      },
    },
    {
      title: "Role",
      key: "role",
      filters: [
        { text: "Admin", value: "admin" },
        { text: "User", value: "user" },
      ],
      onFilter: (value: any, record: any) => record.role === value,
      render: (payload: any) => {
        return payload.role
      },
    },
    {
      title: "Actions",
      key: "action",
      render: (payload: any) => {
        return (
          <div>
            <Space>
              <Button
                key="block"
                type="ghost"
                shape="round"
                className={switchButtonStyle(payload.status)}
                onClick={() => {
                  handleBlockUser(payload._id)
                }}
              >
                {payload.status === "active" ? "Block" : "Unblock"}
              </Button>

              <Button
                key="delete"
                type="ghost"
                shape="round"
                size="small"
                className="adminDeleteButton"
                onClick={() => {
                  setDeleteModal(true)
                  setModalData(payload)
                }}
              >
                <img src={deleteIcon} alt="Delete Icon" className="adminDeleteIcon"></img>
              </Button>
              <Modal
                open={isDeleteModalOpen}
                mask={false}
                onCancel={() => setDeleteModal(false)}
                footer={[
                  <Button
                    key="deleteNo"
                    type="ghost"
                    shape="round"
                    className="defaultButton"
                    onClick={() => {
                      setDeleteModal(false)
                    }}
                  >
                    No
                  </Button>,
                  <Button
                    key="deleteYes"
                    type="ghost"
                    shape="round"
                    className="defaultButton"
                    onClick={() => {
                      handleDelete(modalData._id)
                    }}
                  >
                    Yes
                  </Button>,
                ]}
              >
                {
                  <b>
                    Will you delete {modalData.firstname} {modalData.lastname}?
                  </b>
                }
              </Modal>
            </Space>
          </div>
        )
      },
    },
  ]

  const handleFilter = async () => {
    if (Object.keys(form.getFieldValue()).length !== 0) {
      // CALLS ADMIN FILTER API
      const users = await adminFilter(
        store.getState().auth.token,
        store.getState().auth.refreshToken,
        form.getFieldValue()
      )

      // Updates table
      setUsers(users)
    }
  }

  // handles table reset for filters
  const [tableKey, setTableKey] = useState(0)

  const handleReset = async () => {
    // resets the table
    setUsers(await GetAllUsers(store.getState().auth.token, store.getState().auth.refreshToken))
    setTableKey((tableKey) => tableKey + 1)

    // resets the form
    form.resetFields()
  }

  const renderPageContent = () => {
    if (isAuthenticated) {
      if (localStorage.getItem("userRole") === "admin")
        return (
          <Col>
            <Form form={form} layout="horizontal">
              <Form.Item
                label={<b>Email </b>}
                name="email"
                labelCol={{ span: 2 }}
                wrapperCol={{
                  span: 5,
                }}
                style={{ marginTop: "40px", marginLeft: "0px" }}
              >
                <TextArea
                  placeholder={"Input email..."}
                  autoSize={{
                    minRows: 1,
                    maxRows: 2,
                  }}
                />
              </Form.Item>

              <Form.Item
                label={<b>Lastname </b>}
                name="lastname"
                labelCol={{ span: 7 }}
                wrapperCol={{
                  span: 20,
                }}
                style={{ position: "absolute", top: "0px", left: "345px" }}
              >
                <TextArea
                  placeholder={"Input lastname..."}
                  style={{ marginLeft: "5px" }}
                  autoSize={{
                    minRows: 1,
                    maxRows: 1,
                  }}
                />
              </Form.Item>
            </Form>
            <Button
              key="filter"
              type="ghost"
              shape="round"
              className="defaultButton"
              style={{ position: "absolute", top: "0px", left: "630px" }}
              onClick={() => {
                handleFilter()
              }}
            >
              Filter
            </Button>
            <Button
              key="resetFilter"
              type="ghost"
              shape="round"
              className="defaultButton"
              style={{ position: "absolute", top: "0px", left: "710px" }}
              onClick={() => {
                handleReset()
              }}
            >
              Reset
            </Button>
            <Table
              style={{ marginTop: "35px" }}
              dataSource={users}
              columns={columns}
              key={tableKey}
              rowKey="_id"
              pagination={tableParams.pagination}
              onChange={handleTableChange}
            />
          </Col>
        )
    }
  }

  return <div>{renderPageContent()}</div>
}

const mapToProps = (state: IAuthReduxProps) => ({
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapToProps)(UsersTable)
