import Ajv, { DefinedError } from "ajv"

import { addUserSchema, updateUserSchema, patchUserSchema, adminFilterSchema, changePasswordSchema } from "./user"
import { loginSchema, passwordRecoverSchema } from "./auth"

import addFormats from "ajv-formats"

const ajv = new Ajv({ coerceTypes: true, allErrors: true })

addFormats(ajv)

// Defining validation function

// Users handerl validators
export const validateAddUserSchema = ajv.compile(addUserSchema)
export const validateUpdateUserSchema = ajv.compile(updateUserSchema)
export const validatePatchUserSchema = ajv.compile(patchUserSchema)
export const validateAdminFilterSchema = ajv.compile(adminFilterSchema)
export const validateChangePasswordSchema = ajv.compile(changePasswordSchema)

// Auth handler validators
export const validateLoginSchema = ajv.compile(loginSchema)
export const validatePasswordRecoverSchema = ajv.compile(passwordRecoverSchema)

/**
 * @function buildErrorMessage
 * @description It takes a field and an array of errors and returns a string
 * @param {ValidationOption} field - The field that the error is in.
 * @param {DefinedError[]} errors - DefinedError[]
 * @returns a string.
 */
export const buildErrorMessage = (field: "body" | "params" | "query" | "headers", errors: DefinedError[]): string => {
  const [error] = errors

  // Check if error is defined, otherwise use the default error message
  if (!error || !error.message) return ajv.errorsText(errors)

  // Remove the first slash and then replace all slashes with dots
  const instancePath = error.instancePath.slice(1).replace(/\//g, ".")

  // Build the error message based on error keyword
  let message = ""
  switch (error.keyword) {
    case "additionalProperties":
      message = `'${error.params.additionalProperty}' isn't allowed`
      break
    case "dependencies":
      message = error.message
      break
    case "enum":
      message = `'${instancePath}' ${error.message}: [${error.params.allowedValues.join(", ")}]`
      break
    default:
      message = `'${instancePath}' ${error.message}`
      break
  }

  // Build the prefix for the error message
  let prefix = ""
  switch (field) {
    case "body":
      prefix = "The body field"
      break
    case "params":
      prefix = "The param"
      break
    case "query":
      prefix = "The query param"
      break
    case "headers":
      prefix = "The header"
      break
  }

  return `${prefix} ${message}`
}
