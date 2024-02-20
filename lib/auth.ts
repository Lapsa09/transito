import { NextAuthOptions } from 'next-auth'
import CredentialsContainer from 'next-auth/providers/credentials'
import prisma from '@/lib/prismadb'
import bycript from 'bcrypt'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { invitedSignIn, signIn } from '@/services'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsContainer({
      id: 'legajo',
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
      id: 'dni',
      name: 'DNI',
      credentials: {
        dni: { label: 'DNI', type: 'number', placeholder: '12345678' },
        clave: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.dni || !credentials?.clave) {
          throw new Error('Credenciales invalidas')
        }
        const user = await invitedSignIn({
          dni: +credentials.dni,
          password: credentials.clave,
        })
        if (!user) {
          throw new Error(
            'Su DNI no esta registrado o la clave ya fue utilizada',
          )
        }
        const isPasswordValid = credentials.clave === user.examen.clave

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
    signIn: 'invitados/examen',
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
