"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

const ChatBox = dynamic(() => import("./ChatBox"), { ssr: false })

const faqs = [
  {
    q: "¿Cómo puedo reportar un siniestro?",
    a: "Puedes reportarlo desde la sección 'Reportar' en el inicio o llamando a nuestra línea 24/7.",
  },
  {
    q: "¿Cuándo se renueva mi póliza?",
    a: "Tu póliza se renueva automáticamente cada mes. Recibirás un aviso 3 días antes del cobro.",
  },
  {
    q: "¿Puedo cambiar de plan?",
    a: "Sí, puedes solicitar el cambio desde la sección 'Mi seguro' o contactando a EASY Assist.",
  },
  {
    q: "¿Cómo obtengo mi carnet digital?",
    a: "Tu carnet digital está disponible en la sección 'Mi seguro'. Puedes descargarlo o compartirlo.",
  },
]

export default function AyudaPage() {
  return (
    <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Centro de Ayuda</h1>

      <Suspense fallback={null}>
        <ChatBox />
      </Suspense>

      <h2 className="text-lg font-semibold text-zinc-900 mb-4">Consultas frecuentes</h2>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <details key={faq.q} className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
            <summary className="px-4 py-3 text-sm font-medium text-zinc-700 cursor-pointer hover:bg-zinc-50 transition-colors">
              {faq.q}
            </summary>
            <p className="px-4 pb-3 text-sm text-zinc-500">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </main>
  )
}
