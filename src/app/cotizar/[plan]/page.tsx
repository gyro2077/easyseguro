import { Suspense } from "react"
import Link from "next/link"
import { ProgressBar } from "@/components/ProgressBar"
import { getPlanBySlug } from "@/lib/data"

export function generateStaticParams() {
  return [{ plan: "basico" }, { plan: "vida-protegida" }, { plan: "premium" }]
}

async function PlanContent({ slug }: { slug: string }) {
  const plan = await getPlanBySlug(slug)

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16">
        <h1 className="text-xl font-bold">Plan no encontrado</h1>
        <Link href="/cotizar" className="text-brand-blue mt-4">Volver</Link>
      </div>
    )
  }

  const { features } = plan
  const yesFeatures = features
  const noFeatures = [
    "Cirugía estética",
    "Enfermedades preexistentes",
    "Tratamientos experimentales",
  ]

  return (
    <>
      <ProgressBar step={3} total={4} />
      <h1 className="text-2xl font-bold text-zinc-900 mt-6 mb-1">
        {plan.name}
      </h1>
      <p className="text-3xl font-bold text-brand-blue mb-8">
        ${plan.price.toFixed(2)}<span className="text-base font-normal text-zinc-400">/mes</span>
      </p>
      <p className="text-zinc-500 text-sm mb-6">{plan.description}</p>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-brand-green mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-brand-green/10 rounded-full flex items-center justify-center text-sm">✓</span>
            SÍ cubre
          </h2>
          <ul className="space-y-2">
            {yesFeatures.map((item) => (
              <li key={item} className="flex items-start gap-3 bg-brand-green/5 rounded-xl p-3">
                <span className="text-brand-green mt-0.5 shrink-0">✓</span>
                <span className="text-sm text-zinc-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand-red mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-brand-red/10 rounded-full flex items-center justify-center text-sm">✗</span>
            NO cubre
          </h2>
          <ul className="space-y-2">
            {noFeatures.map((item) => (
              <li key={item} className="flex items-start gap-3 bg-brand-red/5 rounded-xl p-3">
                <span className="text-brand-red mt-0.5 shrink-0">✗</span>
                <span className="text-sm text-zinc-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <Link
        href={`/pago/${plan.slug}`}
        className="block w-full text-center py-4 bg-brand-yellow text-brand-blue rounded-xl font-semibold text-lg hover:bg-yellow-400 transition-colors mt-8"
      >
        Contratar ahora
      </Link>
    </>
  )
}

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ plan: string }>
}) {
  const { plan } = await params

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
        <Suspense fallback={<div className="text-center py-16 text-zinc-400">Cargando...</div>}>
          <PlanContent slug={plan} />
        </Suspense>
      </main>
    </div>
  )
}
