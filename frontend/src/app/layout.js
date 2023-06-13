import './globals.css'

import React from 'react'

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


