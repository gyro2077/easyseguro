import NextAuth from "next-auth"

import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [

    Credentials({
      name: "credentials",
      credentials: {
        cedula: { label: "Cédula", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const cedula = credentials?.cedula as string
        const password = credentials?.password as string

        if (!cedula || !password) return null

        const user = await prisma.user.findUnique({ where: { cedula } })
        if (!user || !user.password) return null

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return null

        return { id: user.id, name: `${user.nombre} ${user.apellido}`, email: user.correo }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn() {
      return true
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
