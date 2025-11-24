// Neon Database Client
import { neon } from "@neondatabase/serverless"

let sql

// Initialize Neon connection only once
if (!sql) {
  sql = neon(process.env.DATABASE_URL)
}

export const dbQuery = async (query, params = []) => {
  try {
    const result = await sql(query, params)
    return { data: result, error: null }
  } catch (error) {
    console.error("[DB Error]", error)
    return { data: null, error: error.message }
  }
}

export const getSingleRecord = async (query, params = []) => {
  const { data, error } = await dbQuery(query, params)
  if (error) return { data: null, error }
  return { data: data?.[0] || null, error: null }
}

export default sql
