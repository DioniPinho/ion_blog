'use client'

import { usePathname } from 'next/navigation'
import { Toaster } from 'sonner'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/dkkd/login'

  // Login page has its own layout
  if (isLoginPage) {
    return (
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-background">
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  )
}
