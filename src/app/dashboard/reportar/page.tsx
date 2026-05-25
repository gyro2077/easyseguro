import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { requireSession } from "@/lib/session"
import { getActivePlans, getUserPolicies } from "@/lib/data"
import { ReportarForm } from "./ReportarForm"

export default async function ReportarPage() {
  return (
    <Suspense fallback={<div className="flex-1 px-6 py-8 max-w-lg mx-auto w-full text-zinc-400 text-center">Cargando...</div>}>
      <ReportarContent />
    </Suspense>
  )
}

async function ReportarContent() {
  const userId = await requireSession()

  const [policies, plans, claims] = await Promise.all([
    getUserPolicies(userId),
    getActivePlans(),
    prisma.claim.findMany({
      where: { userId },
      include: { policy: { include: { plan: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const activePolicy = policies.find((p) => p.status === "ACTIVE") ?? null

  const serializedClaims = claims.map((c) => ({
    id: c.id,
    description: c.description,
    features: c.features,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
    policy: { plan: { name: c.policy.plan.name } },
  }))

  return (
    <ReportarForm
      activePolicy={
        activePolicy
          ? {
              id: activePolicy.id,
              planId: activePolicy.planId,
              price: activePolicy.price,
              status: activePolicy.status,
              paymentMethod: activePolicy.paymentMethod,
              nextPayment: activePolicy.nextPayment,
              plan: {
                id: activePolicy.plan.id,
                name: activePolicy.plan.name,
                slug: activePolicy.plan.slug,
                price: activePolicy.plan.price,
                description: activePolicy.plan.description,
                features: activePolicy.plan.features,
                recommended: activePolicy.plan.recommended,
              },
            }
          : null
      }
      allPlans={plans.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        description: p.description,
        features: p.features,
        recommended: p.recommended,
      }))}
      initialClaims={serializedClaims}
    />
  )
}
