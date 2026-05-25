"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface PlanInfo {
  id: string
  name: string
  slug: string
  price: number
  description: string
  features: string[]
  recommended: boolean
}

interface PolicyInfo {
  id: string
  planId: string
  price: number
  status: string
  paymentMethod: string
  nextPayment: Date
  plan: PlanInfo
}

interface ClaimInfo {
  id: string
  description: string
  features: string[]
  status: string
  createdAt: string
  policy: { plan: { name: string } }
}

interface GroupedFeature {
  planName: string
  isCurrentPlan: boolean
  features: string[]
}

export function ReportarForm({
  activePolicy,
  allPlans,
  initialClaims,
}: {
  activePolicy: PolicyInfo | null
  allPlans: PlanInfo[]
  initialClaims: ClaimInfo[]
}) {
  const router = useRouter()
  const [claims, setClaims] = useState<ClaimInfo[]>(initialClaims)
  const [description, setDescription] = useState("")
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const groupedFeatures: GroupedFeature[] = []
  const seenFeatures = new Set<string>()

  for (const plan of allPlans) {
    if (activePolicy && plan.price > activePolicy.plan.price) break

    const uniqueToThisPlan = plan.features.filter((f) => {
      const isRedundant = f.toLowerCase().includes("todo lo del")
      return !seenFeatures.has(f) && !isRedundant
    })
    for (const f of uniqueToThisPlan) seenFeatures.add(f)

    if (uniqueToThisPlan.length > 0) {
      groupedFeatures.push({
        planName: plan.name,
        isCurrentPlan: activePolicy ? plan.id === activePolicy.planId : false,
        features: uniqueToThisPlan,
      })
    }
  }

  function toggleFeature(f: string) {
    setSelectedFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    )
  }

  function handleSelectAll() {
    const all = new Set<string>()
    for (const g of groupedFeatures) for (const f of g.features) all.add(f)
    const allArr = [...all]
    const allSelected = allArr.every((f) => selectedFeatures.includes(f))
    setSelectedFeatures(allSelected ? [] : allArr)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!activePolicy || !description.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policyId: activePolicy.id,
          description,
          features: selectedFeatures,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        toast.success("Siniestro reportado", {
          description: "Tu reporte ha sido registrado y está en revisión.",
        })
        setDescription("")
        setSelectedFeatures([])
        const claimsRes = await fetch("/api/claims")
        const claimsData = await claimsRes.json()
        if (claimsData.claims) setClaims(claimsData.claims)
      } else {
        toast.error("Error", { description: data.error })
      }
    } catch {
      toast.error("Error de red", {
        description: "No se pudo enviar el reporte.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      "EN REVISIÓN": "bg-yellow-100 text-yellow-700",
      APROBADO: "bg-green-100 text-green-700",
      RECHAZADO: "bg-red-100 text-red-700",
    }
    return `text-xs font-semibold px-2.5 py-1 rounded-full ${colors[status] || "bg-zinc-100 text-zinc-600"}`
  }

  if (!activePolicy) {
    return (
      <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
        <h1 className="text-2xl font-bold text-zinc-900 mb-6">Reportar Siniestro</h1>
        <div className="bg-zinc-50 rounded-2xl p-6 text-center">
          <p className="text-zinc-500 mb-3">No tienes un seguro activo para reportar.</p>
          <button
            onClick={() => router.push("/cotizar")}
            className="py-3 px-6 bg-brand-blue text-white rounded-xl font-semibold text-sm hover:bg-blue-900 transition-colors"
          >
            Cotizar ahora
          </button>
        </div>
        {renderHistory()}
      </main>
    )
  }

  function renderHistory() {
    return (
      <>
        <h2 className="text-lg font-semibold text-zinc-900 mt-10 mb-4">Historial de Reportes</h2>
        {claims.length === 0 ? (
          <p className="text-sm text-zinc-400">No has reportado ningún siniestro aún.</p>
        ) : (
          <div className="space-y-3">
            {claims.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-zinc-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={statusBadge(c.status)}>{c.status}</span>
                  <span className="text-xs text-zinc-400">
                    Plan {c.policy.plan.name} &middot;{" "}
                    {new Date(c.createdAt).toLocaleDateString("es-EC", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-zinc-700 mb-2">{c.description}</p>
                {c.features.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {c.features.map((f) => (
                      <span
                        key={f}
                        className="text-xs bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </>
    )
  }

  return (
    <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Reportar Siniestro</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-zinc-100 p-5">
          <p className="text-xs text-zinc-400 mb-1">Plan activo</p>
          <p className="font-semibold text-zinc-900">{activePolicy.plan.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Describe el siniestro
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe lo ocurrido con el mayor detalle posible..."
            rows={4}
            required
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 resize-none"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-zinc-700">Coberturas afectadas</p>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs text-brand-blue font-semibold hover:underline"
            >
              Seleccionar todas
            </button>
          </div>

          <div className="space-y-4">
            {groupedFeatures.map((group) => (
              <div key={group.planName} className="space-y-2">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  De {group.planName}{group.isCurrentPlan ? " (Exclusivo)" : ""}
                </p>
                {group.features.map((f) => (
                  <label
                    key={f}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      selectedFeatures.includes(f)
                        ? "border-brand-blue bg-blue-50"
                        : "border-zinc-200 bg-white hover:border-zinc-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(f)}
                      onChange={() => toggleFeature(f)}
                      className="w-4 h-4 text-brand-blue rounded border-zinc-300 focus:ring-brand-blue"
                    />
                    <span className="text-sm text-zinc-700">{f}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !description.trim()}
          className="w-full py-3 bg-brand-blue text-white rounded-xl font-semibold text-sm hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Enviando..." : "Reportar siniestro"}
        </button>
      </form>

      {renderHistory()}
    </main>
  )
}
