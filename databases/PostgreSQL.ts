import { Pool } from "pg"

export const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "api",
  password: "password",
  port: 5432,
})

export const connectToPostgreSQL = () => {
  return pool
}

export const GetById = (table: string, id: string) => {
  pool.query(`SELECT * FROM ${table} WHERE _id = $1`, [id], (error, results) => {
    if (error) throw error

    return results
  })
}

export const GetAll = (table: string) => {
  pool.query(`SELECT * FROM ${table} ORDER BY id ASC`, (error, results) => {
    if (error) throw error

    return results
  })
}

export const Create = (table: string, element: any) => {
  let keys: string[] = []
  let values: any[] = []

  for (const [key, value] of Object.entries(element)) {
    keys.push(key)
    values.push(value)
  }

  const columns = keys.join(", ")

  pool.query(`INSERT INTO ${table} (${columns}) VALUES ($1, $2) RETURNING *`, values, (error, results) => {
    if (error) throw error

    return results
  })
}

export const Update = (table: string, element: any, id: string) => {
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

  pool.query(`UPDATE ${table} SET ${set} WHERE id = $${count}`, [...values, id], (error, results) => {
    if (error) throw error

    return results
  })
}

export const Delete = (table: string, id: string) => {
  pool.query(`DELETE FROM ${table} WHERE id = $1`, [id], (error, results) => {
    if (error) throw error

    return results
  })
}
