"use client"

import Image from "next/image"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [cedula, setCedula] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    try {
      await signIn("google")
      router.refresh()
    } catch {
      setError("Error al iniciar sesión con Google")
    } finally {
      setGoogleLoading(false)
    }
  }

  async function handleManualLogin(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const result = await signIn("credentials", {
      cedula,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Cédula o contraseña incorrectos")
      setPending(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#111827]">
      <div className="flex flex-col items-center justify-center pt-16 pb-12 px-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-20">
            <Image
              src="/icon-192x192.png"
              alt="Easy Seguro"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col justify-center pt-2">
            <h1 className="text-4xl font-bold text-white tracking-wide leading-none">Easy</h1>
            <div className="border-t-2 border-brand-yellow mt-1 pt-1">
              <span className="text-brand-yellow tracking-[0.2em] font-medium text-xs ml-1">SEGURO</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-white rounded-t-3xl px-6 pt-10 pb-8 flex flex-col items-center w-full">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Iniciar sesión</h1>
        <p className="text-zinc-500 text-sm mb-8 text-center">
          Accedé rápido con Google o con tu cédula
        </p>

        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-4 bg-white border-2 border-zinc-200 rounded-xl font-semibold text-zinc-700 hover:border-zinc-300 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Iniciar sesión con Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-sm text-zinc-400">o con tu cédula</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label htmlFor="cedula" className="block text-sm font-medium text-zinc-700 mb-1">
                Número de cédula
              </label>
              <input
                id="cedula"
                type="text"
                required
                pattern="[0-9]{10}"
                title="10 dígitos numéricos"
                value={cedula}
                onChange={(e) => setCedula(e.target.value.replace(/\D/g, "").slice(0, 10))}
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
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                placeholder="Tu contraseña"
              />
            </div>

            {error && (
              <p className="text-brand-red text-sm text-center bg-red-50 rounded-xl p-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-4 bg-brand-blue text-white rounded-xl font-semibold text-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>

        <p className="mt-8 text-sm text-zinc-400">
          ¿No tenés cuenta?{" "}
          <a href="/registro" className="text-brand-blue font-medium hover:underline">
            Crear cuenta
          </a>
        </p>
      </main>
    </div>
  )
}
