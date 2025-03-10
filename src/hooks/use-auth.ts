'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import authApi from '@/lib/api/supabase-auth'

type AuthUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
} | null;

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<AuthUser>(null)
  const router = useRouter()
  const locale = useLocale()
  const pathname = usePathname()

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setIsAuthenticated(false)
        setUser(null)
        return false
      }

      const isAuth = await authApi.checkAuth()
      setIsAuthenticated(isAuth)
      return isAuth
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
      return false
    }
  }

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    const initAuth = async () => {
      try {
        const isAuth = await checkAuth()
        
        if (!mounted) return

        if (isAuth && pathname?.includes('/admin/login')) {
          // If authenticated and on login page, redirect to admin
          router.push(`/${locale}/admin`)
        } else if (!isAuth && pathname?.includes('/admin') && !pathname?.includes('/admin/login')) {
          // If not authenticated and on admin page, redirect to login
          const returnUrl = encodeURIComponent(pathname)
          router.push(`/${locale}/admin/login?from=${returnUrl}`)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initAuth()

    // Cleanup function
    return () => {
      mounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [pathname, locale, router])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await authApi.login(email, password)
      
      if (response.user) {
        setUser(response.user)
        setIsAuthenticated(true)
        return { success: true, user: response.user }
      }
      
      return { success: false, error: 'Login failed' }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await authApi.logout()
      setIsAuthenticated(false)
      setUser(null)
      router.push(`/${locale}/admin/login`)
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuth
  }
}

export default useAuth