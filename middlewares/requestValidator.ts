import type { DefinedError, ValidateFunction } from "ajv"
import { buildErrorMessage } from "../validation"

export const validateRequest = (field: "body" | "params" | "query" | "headers", validate: ValidateFunction) => {
  return (req: any, res: any) => {
    const isValid = validate(req[field])

    if (!isValid) {
      const message = buildErrorMessage(field, validate.errors as DefinedError[])
      return res.status(400).send(message)
    }
  }
}

export const validateBody = (validate: ValidateFunction) => validateRequest("body", validate)
export const validateParams = (validate: ValidateFunction) => validateRequest("params", validate)
export const validateQuery = (validate: ValidateFunction) => validateRequest("query", validate)
export const validateHeaders = (validate: ValidateFunction) => validateRequest("headers", validate)
