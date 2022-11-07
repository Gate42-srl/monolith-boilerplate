import { connectToMongoDB } from "./MongoDB"
import { connectToPostgreSQL } from "./PostgreSQL"

export const connectToDB = async (database: string) => {
  let result: any
  database = database.toLowerCase()

  switch (database) {
    case "mongodb":
      result = await connectToMongoDB()
      break
    case "postgresql":
      result = connectToPostgreSQL()
      break
    default:
      result = null
      break
  }

  return result
}
