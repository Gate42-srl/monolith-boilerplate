import ConfigData from "../config/config.json"

export const GetAllUsers = async (token: string, refresh: string) => {
  try {
    const response = await fetch(`${ConfigData.BACKEND_URL}/users/`, {
      headers: {
        Authorization: token,
        refresh,
      },
      method: "GET",
    })

    return await response.json()
  } catch (error) {
    throw error
  }
}

export const blockUnblockUser = async (token: string, refresh: string, id: string) => {
  try {
    const response = await fetch(`${ConfigData.BACKEND_URL}/users/blockUnblock/${id}`, {
      headers: {
        Authorization: token,
        refresh,
      },
      method: "PUT",
    })

    return await response.json()
  } catch (error) {
    throw error
  }
}

export const deleteUser = async (token: string, refresh: string, id: string) => {
  try {
    const response = await fetch(`${ConfigData.BACKEND_URL}/users/${id}`, {
      headers: {
        Authorization: token,
        refresh,
      },
      method: "DELETE",
    })

    return await response.json()
  } catch (error) {
    throw error
  }
}

export const adminFilter = async (token: string, refresh: string, filterBody: any) => {
  try {
    const response = await fetch(`${ConfigData.BACKEND_URL}/users/adminFilter`, {
      headers: {
        Authorization: token,
        refresh,
      },
      body: JSON.stringify(filterBody),
      method: "POST",
    })

    return await response.json()
  } catch (error) {
    throw error
  }
}

export const changePassword = async (token: string, passwordBody: any) => {
  try {
    const response = await fetch(`${ConfigData.BACKEND_URL}/users/changePassword`, {
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(passwordBody),
      method: "PATCH",
    })

    return await response.status
  } catch (error) {
    throw error
  }
}
