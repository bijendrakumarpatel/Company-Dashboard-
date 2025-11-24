// Authentication API with Neon Database
import { getSingleRecord } from "./dbClient"

// Hash password (in production, use bcrypt)
const hashPassword = (pwd) => Buffer.from(pwd).toString("base64")
const verifyPassword = (pwd, hash) => hashPassword(pwd) === hash

// Login with email/username
export const loginUser = async (identifier, password) => {
  try {
    const { data: user, error } = await getSingleRecord(
      "SELECT id, email, name, role, is_premium, subscription_plan FROM users WHERE email = $1 AND password = $2 AND is_active = true",
      [identifier, hashPassword(password)],
    )

    if (error) throw new Error(error)
    if (!user) throw new Error("Invalid credentials")

    // Generate token (in production, use JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64")

    return {
      user,
      accessToken: token,
      refreshToken: token,
    }
  } catch (error) {
    console.error("[Login Error]", error)
    throw error
  }
}

// Register new user
export const registerUser = async (email, password, name) => {
  try {
    const { data: existing } = await getSingleRecord("SELECT id FROM users WHERE email = $1", [email])

    if (existing) throw new Error("Email already registered")

    const { data: user, error } = await getSingleRecord(
      "INSERT INTO users (email, password, name, role, is_active) VALUES ($1, $2, $3, 'user', true) RETURNING id, email, name, role, subscription_plan",
      [email, hashPassword(password), name],
    )

    if (error) throw new Error(error)

    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64")

    return {
      user,
      accessToken: token,
      refreshToken: token,
    }
  } catch (error) {
    console.error("[Register Error]", error)
    throw error
  }
}

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const { data: user, error } = await getSingleRecord(
      "SELECT id, email, name, role, is_premium, subscription_plan, phone, avatar_url FROM users WHERE id = $1 AND is_active = true",
      [userId],
    )

    if (error) throw new Error(error)
    return user
  } catch (error) {
    console.error("[Get User Error]", error)
    throw error
  }
}

export default {
  loginUser,
  registerUser,
  getUserById,
}
