import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import Toaster from '@/components/Toaster'
import AuthContext from '@/context/AuthContext'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TransitoVL',
  description: 'Secretaria de Transito de Vicente Lopez',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <Header />
          {children}
          <Toaster />
        </AuthContext>
      </body>
    </html>
  )
}
