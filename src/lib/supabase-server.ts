import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerSupabaseClient() {
  const cookieStore = cookies()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing. Please check your environment variables.')
  }
  
  return createServerClient(
    supabaseUrl || '',
    supabaseAnonKey || '',
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options as CookieOptions })
          } catch (error) {
            // This can happen when attempting to set cookies in a middleware
            console.error('Error setting cookie:', error)
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options as CookieOptions })
          } catch (error) {
            console.error('Error removing cookie:', error)
          }
        },
      },
    }
  )
}