import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gold App',
  description: 'Gold App',
  generator: 'Gold App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
