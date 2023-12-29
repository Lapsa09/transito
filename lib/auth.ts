import { NextAuthOptions } from 'next-auth'
import CredentialsContainer from 'next-auth/providers/credentials'
import prisma from '@/lib/prismadb'
import bycript from 'bcrypt'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { signIn } from '@/services'
import { InvitedUser } from '@/types'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsContainer({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        legajo: { label: 'Legajo', type: 'number', placeholder: '12345' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.legajo || !credentials?.password) {
          throw new Error('Credenciales invalidas')
        }
        const user = await signIn(credentials)

        if (!user) {
          throw new Error('Usuario no encontrado')
        }
        const isPasswordValid = await bycript.compare(
          credentials.password,
          user.user_password,
        )
        if (!isPasswordValid) {
          throw new Error('Contraseña invalida')
        }
        return user
      },
    }),
    CredentialsContainer({
      id: 'invited',
      name: 'Invited',
      credentials: {
        dni: { label: 'DNI', type: 'number', placeholder: '12345678' },
        clave: { label: 'Clave', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.dni || !credentials?.clave) {
          throw new Error('Credenciales invalidas')
        }
        const user: InvitedUser | null = await prisma.invitado.findFirst({
          where: {
            dni: +credentials.dni,
            clave: credentials.clave,
            utilizado: false,
          },
          select: {
            apellido: true,
            nombre: true,
            dni: true,
            email: true,
            id: true,
          },
        })

        if (!user) {
          throw new Error('Usuario no encontrado o clave ya utlizada')
        }

        await prisma.invitado.update({
          where: { id: user.id },
          data: { utilizado: true },
        })

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
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    jwt({ token, user }) {
      return { ...token, ...user }
    },
    session({ session, token }) {
      session.user = token

      return session
    },
  },
}
