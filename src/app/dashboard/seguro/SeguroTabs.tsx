"use client"

import { useState } from "react"
import Link from "next/link"

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

export function SeguroTabs({
  activePolicy,
  plans,
  medicalCenters,
}: {
  activePolicy: PolicyInfo | undefined
  plans: PlanInfo[]
  medicalCenters: { name: string; address: string; phone: string }[]
}) {
  const [tab, setTab] = useState<"seguro" | "complementario">("seguro")

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
          {plans.map((p) => (
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
              <Link
                href={activePolicy ? "#" : `/cotizar/${p.slug}`}
                className="inline-block w-full text-center py-2 bg-brand-yellow text-brand-blue rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors"
                onClick={(e) => {
                  if (!activePolicy) return
                  e.preventDefault()
                  alert("Contrata este plan complementario desde la sección de cotización.")
                }}
              >
                {p.slug === "vida-protegida" || p.slug === activePolicy?.plan.slug
                  ? "Ver detalles"
                  : "Mejorar plan"}
              </Link>
            </div>
          ))}
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
    </>
  )
}
