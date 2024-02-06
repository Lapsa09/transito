import { Inter } from 'next/font/google'
import './globals.css'
import Header from './header/Header'
import Toaster from '@/components/Toaster'
import AuthContext from '@/context/AuthContext'
import { Metadata } from 'next'
import Footer from '@/components/Footer'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TransitoVL',
  description: 'Secretaria de Transito de Vicente Lopez',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthContext>
          <section className="layout">
            <Header user={session?.user} />
            <div className="main">{children}</div>
            <Footer />
          </section>
          <Toaster />
        </AuthContext>
      </body>
    </html>
  )
}
