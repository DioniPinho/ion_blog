import axios from 'axios'
import { API_URL } from '../config'

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export interface LoginResponse {
  access: string
  refresh: string
  user: User
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL || 'http://34.70.134.127:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Add request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Configure axios instance with credentials
api.defaults.withCredentials = true

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

// Add response interceptor for handling auth responses
api.interceptors.response.use(
  response => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return api(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshResponse = await api.post('/auth/refresh/')
        isRefreshing = false
        processQueue(null)
        return api(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        processQueue(refreshError)
        window.location.href = '/dkkd/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

// Mock user for development
const mockUser = {
  id: '1',
  username: 'admin',
  email: 'admin@example.com',
  first_name: 'Admin',
  last_name: 'User',
  is_staff: true,
  is_superuser: true,
};

// TODO: Re-enable proper authentication after blog development is complete
const isDevelopment = process.env.NODE_ENV === 'development';

export const auth = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    if (isDevelopment) {
      return { access: 'mock_access_token', refresh: 'mock_refresh_token', user: mockUser };
    }
    console.log('Attempting login for user:', username)
    const response = await api.post<LoginResponse>('/auth/login/', { username, password })
    console.log('Login successful')
    
    // Store the access token
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access)
    }
    
    return response.data
  },

  logout: async (): Promise<void> => {
    if (isDevelopment) {
      return true;
    }
    try {
      await api.post('/auth/logout/')
    } finally {
      localStorage.removeItem('access_token')
      window.location.href = '/dkkd/login'
    }
  },

  getMe: async (): Promise<User> => {
    if (isDevelopment) {
      return mockUser;
    }
    const response = await api.get<User>('/users/me/')
    return response.data
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      await auth.getMe()
      return true
    } catch {
      return false
    }
  },
}

export default auth