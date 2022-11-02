import { UserIdValidator } from "./validators"

/**
 * @function userControllerFactory
 * @description Retrieve a PropertyValidator based on request
 * @param {*} request The HttpRequest
 * @returns {PropertyValidator} A property validator
 */
export const userControllerFactory = (request: any) => {
  const { userId, id, structureId, mail } = request.params

  if (userId || id) return new UserIdValidator(request, userId || id)
}
