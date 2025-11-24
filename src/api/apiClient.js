const axios = require('axios');

// --- START: VERCEL PRODUCTION URL HARDCODE ---
// The Live API URL from your Vercel deployment (Serverless Function).
// This is done because the VITE_API_URL variable might not be set correctly.
const API_BASE_URL = "https://laxmi-jee-dashboard-chwu5ohg5-bijendras-projects-06f0c073.vercel.app/api";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const tokenStorage = {
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setTokens({ accessToken, refreshToken }) {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Basic error logging (can be extended for refresh-token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.error("API Error:", error?.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
