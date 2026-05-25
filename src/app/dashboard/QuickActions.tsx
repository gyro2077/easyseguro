"use client"

import Link from "next/link"
import { useState } from "react"
import { ConfirmModal } from "@/components/ConfirmModal"

const actions = [
  { label: "Pagar", icon: "💳", color: "bg-brand-blue", id: "pagar" },
  { label: "Reportar", icon: "📋", color: "bg-brand-green", id: "reportar" },
  { label: "Mi póliza", icon: "🛡️", color: "bg-brand-yellow", id: "poliza", href: "/dashboard/seguro" },
  { label: "Chat", icon: "💬", color: "bg-zinc-800", id: "chat" },
]

export function QuickActions({ hasPolicy }: { hasPolicy: boolean }) {
  const [modal, setModal] = useState<{ title: string; message: string; confirmLabel?: string; onConfirm?: () => void } | null>(null)

  function handleClick(id: string) {
    switch (id) {
      case "pagar":
        if (hasPolicy) {
          setModal({
            title: "Estás al día",
            message: "Tu póliza está activa y sin pagos pendientes. No necesitas realizar ningún pago en este momento.",
            confirmLabel: "Entendido",
          })
        } else {
          setModal({
            title: "Sin póliza activa",
            message: "Aún no tienes un seguro contratado. Cotiza ahora para protegerte.",
            confirmLabel: "Ir a cotizar",
            onConfirm: () => { window.location.href = "/cotizar" },
          })
        }
        break
      case "reportar":
        window.location.href = "/dashboard/ayuda"
        break
      case "chat":
        window.open("https://wa.me/593999999999", "_blank")
        break
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((a) => {
          if (a.href) {
            return (
              <Link
                key={a.id}
                href={a.href}
                className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-zinc-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${a.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                  {a.icon}
                </div>
                <span className="text-sm font-medium text-zinc-700">{a.label}</span>
              </Link>
            )
          }
          return (
            <button
              key={a.id}
              onClick={() => handleClick(a.id)}
              className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-zinc-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className={`w-12 h-12 ${a.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                {a.icon}
              </div>
              <span className="text-sm font-medium text-zinc-700">{a.label}</span>
            </button>
          )
        })}
      </div>

      <ConfirmModal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.title || ""}
        message={modal?.message || ""}
        confirmLabel={modal?.confirmLabel}
        onConfirm={modal?.onConfirm}
      />
    </>
  )
}
