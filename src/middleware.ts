import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { defaultLocale, locales } from '@/app/i18n'

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

// List of public routes that don't require authentication
const publicRoutes = [
  '/dkkd/login',
  '/api/auth/login',
  '/api/auth/refresh',
]

// TODO: Re-enable authentication middleware after blog development is complete
// Middleware function to check authentication for admin routes
const authMiddleware = async (request: NextRequest) => {
  // Authentication temporarily disabled for development
  return null

  /*
  const path = request.nextUrl.pathname

  // Skip auth check for public routes
  if (publicRoutes.some(route => path.startsWith(route))) {
    return null
  }

  // Check if it's an admin route
  if (path.startsWith('/dkkd')) {
    // Check for access token cookie
    const accessToken = request.cookies.get('access_token')
    const refreshToken = request.cookies.get('refresh_token')

    // If no tokens present, redirect to login
    if (!accessToken && !refreshToken) {
      const url = new URL('/dkkd/login', request.url)
      return NextResponse.redirect(url)
    }

    // If only refresh token exists, try to refresh the access token
    if (!accessToken && refreshToken) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ refresh: refreshToken.value }),
        })

        if (!response.ok) {
          // If refresh fails, redirect to login
          const url = new URL('/dkkd/login', request.url)
          return NextResponse.redirect(url)
        }

        // Get the new access token from response cookies
        const cookies = response.headers.get('set-cookie')
        if (cookies) {
          const newAccessToken = cookies
            .split(';')
            .find(c => c.trim().startsWith('access_token='))
            ?.split('=')[1]

          if (newAccessToken) {
            // Allow the request to proceed with the new access token
            const requestHeaders = new Headers(request.headers)
            requestHeaders.set('Authorization', `Bearer ${newAccessToken}`)
            return NextResponse.next({
              request: {
                headers: requestHeaders,
              },
            })
          }
        }
      } catch (error) {
        // If refresh request fails, redirect to login
        const url = new URL('/dkkd/login', request.url)
        return NextResponse.redirect(url)
      }
    }

    // Allow the request to proceed with the existing access token
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('Authorization', `Bearer ${accessToken.value}`)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return null
  */
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Handle admin routes
  if (path.startsWith('/dkkd')) {
    const authResponse = await authMiddleware(request)
    if (authResponse) return authResponse
    
    // For admin routes, just add security headers
    const response = NextResponse.next()
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    return response
  }
  
  // Handle internationalized routes
  const response = intlMiddleware(request)
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … if they contain a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Match all pathnames within `/dkkd`
    '/dkkd/:path*'
  ]
}