import { Suspense } from "react"
import Link from "next/link"
import { requireSession } from "@/lib/session"
import { getUserWithPolicy, getUserPolicies } from "@/lib/data"
import { logoutUser } from "@/lib/actions"

const quickActions = [
  { label: "Pagar", icon: "💳", href: "#", color: "bg-brand-blue" },
  { label: "Reportar", icon: "📋", href: "#", color: "bg-brand-green" },
  { label: "Mi póliza", icon: "🛡️", href: "/dashboard/seguro", color: "bg-brand-yellow" },
  { label: "Chat", icon: "💬", href: "#", color: "bg-zinc-800" },
]

async function DashboardContent() {
  const userId = await requireSession()
  const user = await getUserWithPolicy(userId)
  const policies = await getUserPolicies(userId)
  const activePolicy = policies.find((p) => p.status === "ACTIVE")
  const userName = user ? user.nombre.split(" ")[0] : ""

  return (
    <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Hola, {userName} 👋</h1>
          <p className="text-zinc-500 text-sm">Bienvenido a tu panel</p>
        </div>
        <form action={logoutUser}>
          <button
            type="submit"
            className="text-xs text-zinc-400 hover:text-brand-red transition-colors"
          >
            Cerrar sesión
          </button>
        </form>
      </div>

      {activePolicy ? (
        <div className="bg-gradient-to-br from-brand-blue to-blue-900 rounded-2xl p-6 text-white mb-8">
          <p className="text-sm opacity-80">Tu seguro activo</p>
          <p className="text-xl font-bold mt-1">{activePolicy.plan.name}</p>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-xs opacity-80">Próximo pago</p>
              <p className="font-semibold">
                {new Date(activePolicy.nextPayment).toLocaleDateString("es-EC", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <span className="bg-brand-green text-xs font-bold px-3 py-1 rounded-full">
              ACTIVO
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-50 rounded-2xl p-6 mb-8 text-center">
          <p className="text-zinc-500 mb-3">Aún no tienes un seguro activo</p>
          <Link
            href="/cotizar"
            className="inline-block py-3 px-6 bg-brand-blue text-white rounded-xl font-semibold text-sm hover:bg-blue-900 transition-colors"
          >
            Cotizar ahora
          </Link>
        </div>
      )}

      <h2 className="text-lg font-semibold text-zinc-900 mb-4">Acciones rápidas</h2>
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-zinc-100 p-6 hover:shadow-md transition-shadow"
          >
            <div
              className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white text-xl`}
            >
              {action.icon}
            </div>
            <span className="text-sm font-medium text-zinc-700">{action.label}</span>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default function DashboardHome() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-zinc-100 rounded-xl w-48" />
            <div className="h-32 bg-zinc-100 rounded-2xl" />
            <div className="h-6 bg-zinc-100 rounded-xl w-32" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-28 bg-zinc-100 rounded-2xl" />
              <div className="h-28 bg-zinc-100 rounded-2xl" />
              <div className="h-28 bg-zinc-100 rounded-2xl" />
              <div className="h-28 bg-zinc-100 rounded-2xl" />
            </div>
          </div>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
