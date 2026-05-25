"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ConfirmModal } from "@/components/ConfirmModal"

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

const exclusions = [
  "Enfermedades preexistentes no declaradas",
  "Siniestros bajo efectos del alcohol",
  "Actos temerarios o intencionales",
  "Guerra o eventos nucleares",
]

export function SeguroTabs({
  activePolicy,
  plans,
  medicalCenters,
}: {
  activePolicy: PolicyInfo | undefined
  plans: PlanInfo[]
  medicalCenters: { name: string; address: string; phone: string }[]
}) {
  const router = useRouter()
  const [tab, setTab] = useState<"seguro" | "complementario">("seguro")
  const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    title: string
    message: string
    onConfirm: () => void
  } | null>(null)
  const [upgrading, setUpgrading] = useState(false)

  async function handleChangePlan(newPlan: PlanInfo) {
    if (!activePolicy) return
    const isUpgrade = newPlan.price > activePolicy.plan.price

    if (isUpgrade) {
      setSelectedPlan(null)
      router.push(`/pago/${newPlan.slug}?upgrade=true&policyId=${activePolicy.id}`)
      return
    }

    setUpgrading(true)
    try {
      const res = await fetch("/api/policy/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policyId: activePolicy.id,
          newPlanId: newPlan.id,
        }),
      })
      const data = await res.json()

      if (!data.ok) {
        toast.error("Error", { description: data.error })
        return
      }

      toast.success("Plan actualizado", { description: `Ahora tienes el plan ${data.planName}.` })
      setSelectedPlan(null)
      router.refresh()
    } catch {
      toast.error("Error de red", { description: "No se pudo procesar la solicitud." })
    } finally {
      setUpgrading(false)
    }
  }



  return (
    <>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("seguro")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
            tab === "seguro"
              ? "bg-brand-blue text-white"
              : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
          }`}
        >
          Mi seguro
        </button>
        <button
          onClick={() => setTab("complementario")}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
            tab === "complementario"
              ? "bg-brand-blue text-white"
              : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
          }`}
        >
          Complementario
        </button>
      </div>

      {tab === "seguro" ? (
        activePolicy ? (
          <div className="bg-white rounded-2xl border border-zinc-100 p-5 mb-6">
            <h2 className="font-semibold text-zinc-900 mb-2">{activePolicy.plan.name}</h2>
            <div className="space-y-2 text-sm text-zinc-600">
              <div className="flex justify-between">
                <span>Estado</span>
                <span className="text-brand-green font-medium">ACTIVO</span>
              </div>
              <div className="flex justify-between">
                <span>Pago mensual</span>
                <span className="font-medium">${activePolicy.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Método de pago</span>
                <span className="capitalize">{activePolicy.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Próximo pago</span>
                <span>
                  {new Date(activePolicy.nextPayment).toLocaleDateString("es-EC", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-50 rounded-2xl p-6 mb-6 text-center">
            <p className="text-zinc-500 mb-3">No tienes un seguro activo</p>
            <Link
              href="/cotizar"
              className="inline-block py-3 px-6 bg-brand-blue text-white rounded-xl font-semibold text-sm hover:bg-blue-900 transition-colors"
            >
              Cotizar ahora
            </Link>
          </div>
        )
      ) : (
        <div className="space-y-4 mb-6">
          <p className="text-sm text-zinc-500 mb-4">
            Complementa tu protección con estos seguros adicionales
          </p>
          {plans.map((p) => {
            const isCurrentPlan = activePolicy && p.slug === activePolicy.plan.slug
            const isUpgrade = activePolicy && p.price > activePolicy.plan.price

            let buttonLabel = "Ver detalles"
            if (isCurrentPlan) buttonLabel = "Tu plan actual"
            else if (isUpgrade) buttonLabel = "Mejorar plan"
            else if (activePolicy) buttonLabel = "Plan inferior"

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-zinc-100 p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-zinc-900">{p.name}</h3>
                  <span className="text-sm font-bold text-brand-blue">
                    ${p.price.toFixed(2)}<span className="text-xs font-normal text-zinc-400">/mes</span>
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mb-3">{p.description}</p>
                <button
                  onClick={() => setSelectedPlan(p)}
                  disabled={!!isCurrentPlan}
                  className={`inline-block w-full text-center py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isCurrentPlan
                      ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                      : "bg-brand-yellow text-brand-blue hover:bg-yellow-400"
                  }`}
                >
                  {buttonLabel}
                </button>
              </div>
            )
          })}
        </div>
      )}

      <h2 className="text-lg font-semibold text-zinc-900 mb-3">Centros médicos afiliados</h2>
      <div className="space-y-3">
        {medicalCenters.map((center) => (
          <div key={center.name} className="bg-white rounded-xl border border-zinc-100 p-4">
            <h3 className="font-medium text-zinc-900 text-sm">{center.name}</h3>
            <p className="text-xs text-zinc-400 mt-1">{center.address}</p>
            <p className="text-xs text-brand-blue mt-1">{center.phone}</p>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 animate-in slide-in-from-bottom-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-zinc-900">{selectedPlan.name}</h3>
              <button onClick={() => setSelectedPlan(null)} className="text-zinc-500 hover:text-zinc-700 font-bold text-xl leading-none">&times;</button>
            </div>
            <p className="text-sm text-zinc-600 mb-4">{selectedPlan.description}</p>

            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-brand-blue text-sm">Lo que cubre:</h4>
              <ul className="space-y-2">
                {selectedPlan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-zinc-700">
                    <span className="text-brand-green shrink-0">&#10003;</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <h4 className="font-semibold text-red-500 text-sm mt-4">Lo que no cubre:</h4>
              <ul className="space-y-2">
                {exclusions.map((exc) => (
                  <li key={exc} className="flex gap-2 text-sm text-zinc-700">
                    <span className="text-red-500 shrink-0">&#10007;</span>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {activePolicy && selectedPlan.slug !== activePolicy.plan.slug ? (
              <button
                onClick={() => handleChangePlan(selectedPlan)}
                disabled={upgrading}
                className="w-full bg-brand-blue text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-900 transition-colors disabled:opacity-50"
              >
                {upgrading ? "Procesando..." : "Cambiar a este plan"}
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedPlan(null)
                  toast.info("Este es tu plan actual.")
                }}
                className="w-full bg-zinc-100 text-zinc-500 py-3 rounded-xl font-semibold text-sm cursor-not-allowed"
                disabled
              >
                Plan actual
              </button>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title={confirmModal?.title || ""}
        message={confirmModal?.message || ""}
        confirmLabel="Confirmar"
        onConfirm={() => {
          confirmModal?.onConfirm()
          setConfirmModal(null)
        }}
      />
    </>
  )
}
