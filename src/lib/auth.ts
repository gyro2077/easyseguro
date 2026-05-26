import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
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
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const existing = await prisma.user.findUnique({ where: { correo: profile.email } })
        if (!existing) {
          await prisma.user.create({
            data: {
              nombre: profile.given_name || profile.name?.split(" ")[0] || "",
              apellido: profile.family_name || profile.name?.split(" ").slice(1).join(" ") || "",
              correo: profile.email,
              cedula: `google_${profile.sub}`,
              googleId: profile.sub,
            },
          })
        } else if (!existing.googleId) {
          await prisma.user.update({
            where: { id: existing.id },
            data: { googleId: profile.sub },
          })
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) token.id = user.id
      if (account?.provider === "google" && account.access_token) {
        const dbUser = await prisma.user.findUnique({ where: { correo: token.email! } })
        if (dbUser) token.id = dbUser.id
      }
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
