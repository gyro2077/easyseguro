import { Suspense } from "react"
import { ProgressBar } from "@/components/ProgressBar"
import { PlanCard } from "@/components/PlanCard"
import { getActivePlans } from "@/lib/data"

async function PlanList() {
  const plans = await getActivePlans()

  if (plans.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-400">
        No hay planes disponibles en este momento.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          name={plan.name}
          price={plan.price}
          description={plan.description}
          features={plan.features}
          href={`/cotizar/${plan.slug}`}
          recommended={plan.recommended}
        />
      ))}
    </div>
  )
}

export default function CotizarPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
        <ProgressBar step={2} total={4} />
        <h1 className="text-2xl font-bold text-zinc-900 mt-6 mb-1">
          Elige tu seguro
        </h1>
        <p className="text-zinc-500 text-sm mb-8">
          Selecciona el plan que mejor se adapte a ti
        </p>

        <Suspense
          fallback={
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-zinc-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          }
        >
          <PlanList />
        </Suspense>
      </main>
    </div>
  )
}
