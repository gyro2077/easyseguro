"use client"

import Link from "next/link"
import { toast } from "sonner"

const actions = [
  { label: "Pagar", icon: "💳", color: "bg-brand-blue", id: "pagar" },
  { label: "Reportar", icon: "📋", color: "bg-brand-green", id: "reportar" },
  { label: "Mi póliza", icon: "🛡️", color: "bg-brand-yellow", id: "poliza", href: "/dashboard/seguro" },
  { label: "Chat", icon: "💬", color: "bg-zinc-800", id: "chat" },
]

export function QuickActions({ hasPolicy }: { hasPolicy: boolean }) {
  function handleClick(id: string) {
    switch (id) {
      case "pagar":
        if (hasPolicy) {
          toast.success("Estás al día", {
            description: "Tu póliza está activa y sin pagos pendientes.",
          })
        } else {
          toast("Sin póliza activa", {
            description: "Aún no tienes un seguro contratado. Cotiza ahora para protegerte.",
            action: {
              label: "Cotizar",
              onClick: () => { window.location.href = "/cotizar" },
            },
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
  )
}
