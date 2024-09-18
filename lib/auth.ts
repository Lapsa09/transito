import { NextAuthOptions } from 'next-auth'
import CredentialsContainer from 'next-auth/providers/credentials'
import { signIn } from '@/services'

export const authOptions = {
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
          throw new Error('Faltan credenciales')
        }
        const user = await signIn(credentials)

        if (!user) {
          throw new Error(
            'No se encontro el legajo o la contraseña es incorrecta',
          )
        }

        return user
      },
    }),
    CredentialsContainer({
      id: 'dni',
      name: 'DNI',
      credentials: {
        dni: { label: 'DNI', type: 'number', placeholder: '12345678' },
      },
      async authorize(credentials) {
        if (!credentials?.dni) {
          throw new Error('Falta el DNI')
        }
        const user = await signIn(credentials)

        if (!user) {
          throw new Error('Su DNI no esta registrado')
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
} satisfies NextAuthOptions
