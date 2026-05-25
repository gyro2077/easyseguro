import { Suspense } from "react"
import { requireSession } from "@/lib/session"
import { getUserWithPolicy, getUserPolicies } from "@/lib/data"
import { PerfilContent } from "./PerfilContent"

async function PerfilData() {
  const userId = await requireSession()
  const user = await getUserWithPolicy(userId)
  const policies = await getUserPolicies(userId)

  if (!user) {
    return <p className="text-center py-16 text-zinc-400">Usuario no encontrado</p>
  }

  const initials = `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase()
  const fullName = `${user.nombre} ${user.apellido}`
  const activePolicy = policies.find((p) => p.status === "ACTIVE")

  return (
    <PerfilContent
      userId={user.id}
      userName={fullName}
      userEmail={user.correo}
      userCedula={user.cedula}
      profileImage={user.profileImage}
      initials={initials}
      policies={policies.map((p) => ({
        id: p.id,
        planName: p.plan.name,
        status: p.status,
        createdAt: p.createdAt,
      }))}
      activePolicyId={activePolicy?.id}
      activePolicyPlan={activePolicy?.plan.name}
    />
  )
}

export default function PerfilPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-zinc-100 rounded-full" />
              <div className="space-y-2">
                <div className="h-5 bg-zinc-100 rounded-xl w-36" />
                <div className="h-4 bg-zinc-100 rounded-xl w-48" />
              </div>
            </div>
            <div className="h-32 bg-zinc-100 rounded-2xl" />
            <div className="h-24 bg-zinc-100 rounded-2xl" />
          </div>
        </main>
      }
    >
      <PerfilData />
    </Suspense>
  )
}
