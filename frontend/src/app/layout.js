import './globals.css'
import { Inter } from 'next/font/google'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Nav-E',
  description: 'Plan trips more efficiently.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className='main'>
        </div> 
      
        <main className = 'app'>
          {children}
        </main>
      </body>

    </html>
  )
}


