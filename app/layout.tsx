import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from './header'
import Toaster from '@/components/Toaster'
import AuthContext from '@/context/AuthContext'
import { Metadata } from 'next'
import Footer from '@/components/Footer'

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
    <html lang="es">
      <body className={inter.className}>
        <AuthContext>
          <section className="layout">
            <Header />
            <div className="main">{children}</div>
            <Footer />
          </section>
          <Toaster />
        </AuthContext>
      </body>
    </html>
  )
}
