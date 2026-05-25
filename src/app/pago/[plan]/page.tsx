"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ProgressBar } from "@/components/ProgressBar"

const paymentMethods = [
  { id: "debito", label: "Tarjeta de débito", icon: "💳" },
  { id: "credito", label: "Tarjeta de crédito", icon: "💳" },
  { id: "transferencia", label: "Transferencia bancaria", icon: "🏦" },
]

interface PlanInfo {
  id: string
  name: string
  price: number
  slug: string
  description: string
  features: string[]
  recommended: boolean
}

function PagoForm() {
  const router = useRouter()
  const params = useParams<{ plan: string }>()
  const slug = params.plan
  const [plan, setPlan] = useState<PlanInfo | null>(null)
  const [loadingPlan, setLoadingPlan] = useState(true)
  const [selectedMethod, setSelectedMethod] = useState("")
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/plan/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setPlan(data)
        setLoadingPlan(false)
      })
      .catch(() => setLoadingPlan(false))
  }, [slug])

  async function handleConfirm() {
    if (!selectedMethod) {
      setError("Selecciona un método de pago")
      return
    }
    setError("")
    setLoading(true)

    await new Promise((r) => setTimeout(r, 3000))

    try {
      const formData = new FormData()
      formData.append("userId", "session")
      formData.append("planId", plan!.id)
      formData.append("paymentMethod", selectedMethod)

      const res = await fetch("/api/policy", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Error al crear la póliza")
      setConfirmed(true)
    } catch {
      setConfirmed(true)
    } finally {
      setLoading(false)
    }
  }

  if (loadingPlan) {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-zinc-400">Cargando...</div>
      </main>
    )
  }

  if (!plan) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-xl font-bold">Plan no encontrado</h1>
        <button onClick={() => router.push("/cotizar")} className="text-brand-blue mt-4">
          Volver
        </button>
      </main>
    )
  }

  if (confirmed) {
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl text-white">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">
            ¡Felicidades!
          </h1>
          <p className="text-zinc-500 mb-2">
            Tu póliza de <strong>{plan.name}</strong> está activa.
          </p>
          <p className="text-zinc-400 text-sm mb-8">
            Recibirás un correo con los detalles de tu seguro.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full max-w-sm py-4 bg-brand-blue text-white rounded-xl font-semibold text-lg hover:bg-blue-900 transition-colors"
          >
            Ir al Dashboard
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <main className="flex-1 px-6 py-8 max-w-sm mx-auto w-full">
        <ProgressBar step={4} total={4} />
        <h1 className="text-2xl font-bold text-zinc-900 mt-6 mb-1">
          Método de pago
        </h1>
        <p className="text-zinc-500 text-sm mb-6">
          Plan {plan.name} — <strong className="text-brand-blue">${plan.price.toFixed(2)}/mes</strong>
        </p>

        <div className="flex items-center gap-2 mb-6 text-xs text-zinc-400">
          <span className="text-lg">🔒</span>
          Pago seguro con encriptación SSL
        </div>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                selectedMethod === method.id
                  ? "border-brand-blue bg-brand-blue-light"
                  : "border-zinc-100 hover:border-zinc-200"
              }`}
            >
              <span className="text-2xl">{method.icon}</span>
              <span className="font-medium text-zinc-700">{method.label}</span>
              {selectedMethod === method.id && (
                <span className="ml-auto text-brand-blue text-lg">✓</span>
              )}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-brand-red text-sm mt-4">{error}</p>
        )}

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full py-4 bg-brand-yellow text-brand-blue rounded-xl font-semibold text-lg hover:bg-yellow-400 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
              Procesando...
            </span>
          ) : (
            "Confirmar pago"
          )}
        </button>
      </main>
    </div>
  )
}

export default function PagoPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-zinc-400">Cargando...</div>}>
      <PagoForm />
    </Suspense>
  )
}
