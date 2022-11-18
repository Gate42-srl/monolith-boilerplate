export const getMockedRequest = (options: any = {}) => {
  const req = {
    ...options,
  }

  return req
}

export const getMockedResponse = () => {
  const res = {
    code: function (code: number) {
      return {
        send: function (response: any) {
          return response
        },
      }
    },
  }

  return res
}
