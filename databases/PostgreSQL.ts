import config from "config"
import moment from "moment"
import { Pool } from "pg"

import { logger } from "../winston"
import { dbCheck } from "./dbCheck"

export const pool = new Pool(config.get("POSTGRES_SETTINGS"))

export const connectToPostgreSQL = async () => {
  // Don't init db and don't log on test environment
  if (config.get("MODE") == "test") return pool

  // Check for init
  await dbCheck()

  console.log("PostgreSQL connected...", moment().format())
  // Logs on winston
  logger.info(`Database connection established`, {
    timestamp: moment.utc().format(),
  })

  return pool
}

export const GetById = async (table: string, id: string) => {
  return (await pool.query(`SELECT * FROM ${table} WHERE _id = $1`, [id])).rows[0]
}

export const GetAll = async (table: string) => {
  return (await pool.query(`SELECT * FROM ${table} ORDER BY _id ASC`)).rows
}

export const Create = async (table: string, element: any) => {
  let keys: string[] = []
  let values: any[] = []

  for (const [key, value] of Object.entries(element)) {
    keys.push(key)
    values.push(value)
  }

  const columns = keys.join(", ")

  let count: number = 0
  const valuesCount = values
    .map((value: any) => (value = ++count))
    .join(", $")
    .replace(/^/, "$")

  const result = await pool.query(`INSERT INTO ${table} (${columns}) VALUES (${valuesCount}) RETURNING *`, values)

  return result.rows[0]
}

export const Update = async (table: string, element: any, id: string) => {
  let keys: string[] = []
  let values: any[] = []

  for (const [key, value] of Object.entries(element)) {
    keys.push(key)
    values.push(value)
  }

  let set = keys.join(" = $, ")

  let count = 1
  keys.forEach(() => {
    set = set.replace("$,", `$${count++},`)
  })

  set = set.concat(` = $${count - 1}`)

  await pool.query(`UPDATE ${table} SET ${set} WHERE _id = $${count}`, [...values, id])

  return (await pool.query(`SELECT * FROM ${table} WHERE _id = $1`, [id])).rows[0]
}

export const Delete = async (table: string, id: string) => {
  const deletedElement = (await pool.query(`SELECT * FROM ${table} WHERE _id = $1`, [id])).rows[0]

  await pool.query(`DELETE FROM ${table} WHERE _id = $1`, [id])

  return deletedElement
}
