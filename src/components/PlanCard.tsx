"use client"

import Link from "next/link"

interface PlanCardProps {
  name: string
  price: number
  description: string
  features: string[]
  recommended?: boolean
  href: string
}

export function PlanCard({
  name,
  price,
  description,
  features,
  recommended,
  href,
}: PlanCardProps) {
  return (
    <div
      className={`relative bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${
        recommended ? "border-brand-yellow shadow-md" : "border-zinc-100"
      }`}
    >
      {recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-yellow text-brand-blue text-xs font-bold px-4 py-1 rounded-full">
          RECOMENDADO
        </span>
      )}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-zinc-900">{name}</h3>
        <p className="text-zinc-500 text-sm mt-1">{description}</p>
        <p className="text-3xl font-bold text-brand-blue mt-3">
          ${price.toFixed(2)}<span className="text-base font-normal text-zinc-400">/mes</span>
        </p>
      </div>
      <ul className="space-y-2 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-zinc-600">
            <span className="text-brand-green mt-0.5">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${
          recommended
            ? "bg-brand-yellow text-brand-blue hover:bg-yellow-400"
            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
        }`}
      >
        {recommended ? "Contratar ahora" : "Ver plan"}
      </Link>
    </div>
  )
}
