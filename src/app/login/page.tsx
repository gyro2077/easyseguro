"use client"

import Image from "next/image"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [cedula, setCedula] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

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
          Ingresá con tu número de cédula
        </p>

        <div className="w-full max-w-sm space-y-4">

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
