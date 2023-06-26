import { NextAuthOptions } from 'next-auth'
import CredentialsContainer from 'next-auth/providers/credentials'
import prisma from '@/lib/prismadb'
import bycript from 'bcrypt'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsContainer({
      name: 'Credentials',
      credentials: {
        legajo: { label: 'Legajo', type: 'number', placeholder: '12345' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.legajo || !credentials?.password) {
          throw new Error('Credenciales invalidas')
        }
        const user = await prisma.user.findUnique({
          where: {
            legajo: +credentials.legajo,
          },
          include: {
            op: {
              include: {
                permisos: true,
              },
            },
          },
        })
        if (!user) {
          throw new Error('Usuario no encontrado')
        }
        const isPasswordValid = await bycript.compare(
          credentials.password,
          user.user_password
        )
        if (!isPasswordValid) {
          throw new Error('Contraseña invalida')
        }
        return user
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_URL,

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user }
    },
    async session({ session, token }) {
      session.user = token

      return session
    },
  },
}
