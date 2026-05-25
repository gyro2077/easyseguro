import { Suspense } from "react"
import Link from "next/link"
import { requireSession } from "@/lib/session"
import { getUserPolicies, getActivePlans } from "@/lib/data"
import { SeguroTabs } from "./SeguroTabs"

const medicalCenters = [
  { name: "Clínica San Francisco", address: "Av. Amazonas N35-12", phone: "02 345 6789" },
  { name: "Hospital Metropolitano", address: "Av. Mariana de Jesús Oe7", phone: "02 456 7890" },
  { name: "Centro Médico Integral", address: "Av. 6 de Diciembre N45", phone: "02 567 8901" },
]

async function SeguroContent() {
  const userId = await requireSession()
  const policies = await getUserPolicies(userId)
  const plans = await getActivePlans()
  const activePolicy = policies.find((p) => p.status === "ACTIVE")

  return (
    <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Mi Seguro</h1>

      <SeguroTabs activePolicy={activePolicy} plans={plans} medicalCenters={medicalCenters} />
    </main>
  )
}

export default function SeguroPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-zinc-100 rounded-xl w-40" />
            <div className="h-10 bg-zinc-100 rounded-xl" />
            <div className="h-48 bg-zinc-100 rounded-2xl" />
          </div>
        </main>
      }
    >
      <SeguroContent />
    </Suspense>
  )
}
