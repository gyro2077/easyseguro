export function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = (step / total) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-xs text-zinc-500">
        <span>Paso {step} de {total}</span>
      </div>
      <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-blue rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
