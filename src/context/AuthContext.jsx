import { createContext } from "react"

const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  userType: null,
})

export default AuthContext
