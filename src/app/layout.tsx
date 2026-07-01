import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wolver Training Protocol',
  description: 'A premium hypertrophy tracking system engineered for maximum performance.',
  keywords: ['workout', 'training', 'hypertrophy', 'fitness', 'tracking'],
  openGraph: {
    title: 'Wolver Training Protocol',
    description: 'A premium hypertrophy tracking system engineered for maximum performance.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
