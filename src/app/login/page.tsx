"use client"

import { useActionState } from "react"
import { loginUser } from "@/lib/actions"

export default function LoginPage() {
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string } | null, fd: FormData) => loginUser(fd),
    null
  )

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 bg-brand-blue rounded-2xl flex items-center justify-center mb-6">
          <span className="text-2xl font-black text-white">ES</span>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Iniciar sesión</h1>
        <p className="text-zinc-500 text-sm mb-8 text-center">
          Ingresa tu cédula y contraseña
        </p>

        <form action={action} className="w-full max-w-sm space-y-4">
          <div>
            <label htmlFor="cedula" className="block text-sm font-medium text-zinc-700 mb-1">
              Número de cédula
            </label>
            <input
              id="cedula"
              name="cedula"
              type="text"
              required
              pattern="[0-9]{10}"
              title="10 dígitos numéricos"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-center text-lg tracking-widest"
              placeholder="1234567890"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
              placeholder="Tu contraseña"
            />
          </div>

          {state && "error" in state && state.error && (
            <p className="text-brand-red text-sm text-center bg-red-50 rounded-xl p-3">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full py-4 bg-brand-blue text-white rounded-xl font-semibold text-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-8 text-sm text-zinc-400">
          ¿No tienes cuenta?{" "}
          <a href="/registro" className="text-brand-blue font-medium hover:underline">
            Crear cuenta
          </a>
        </p>
      </main>
    </div>
  )
}
