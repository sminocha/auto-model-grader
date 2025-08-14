import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Model Grader | Performance Comparison Tool',
  description: 'Compare AI model performance side-by-side with automated scoring and detailed metrics.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
