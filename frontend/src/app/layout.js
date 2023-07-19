import './globals.css'
import React from 'react'
import { AuthProvider } from '@/components/auth/AuthContext'
export const metadata = {
  title: 'Nav-E',
  description: 'Plan trips more efficiently.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className = 'app'>
          <AuthProvider>
            {children}
          </AuthProvider>
        </main>
      </body>

    </html>
  )
}


