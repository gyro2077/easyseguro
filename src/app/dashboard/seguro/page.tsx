const medicalCenters = [
  { name: "Clínica San Francisco", address: "Av. Amazonas N35-12", phone: "02 345 6789" },
  { name: "Hospital Metropolitano", address: "Av. Mariana de Jesús Oe7", phone: "02 456 7890" },
  { name: "Centro Médico Integral", address: "Av. 6 de Diciembre N45", phone: "02 567 8901" },
]

export default function SeguroPage() {
  return (
    <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Mi Seguro</h1>

      <div className="flex gap-2 mb-6">
        <button className="flex-1 py-2 bg-brand-blue text-white rounded-xl text-sm font-medium">
          Mi seguro
        </button>
        <button className="flex-1 py-2 bg-zinc-100 text-zinc-500 rounded-xl text-sm font-medium">
          Complementario
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 p-5 mb-6">
        <h2 className="font-semibold text-zinc-900 mb-2">Plan Vida Protegida</h2>
        <div className="space-y-2 text-sm text-zinc-600">
          <div className="flex justify-between">
            <span>Estado</span>
            <span className="text-brand-green font-medium">ACTIVO</span>
          </div>
          <div className="flex justify-between">
            <span>Pago mensual</span>
            <span className="font-medium">$19.99</span>
          </div>
          <div className="flex justify-between">
            <span>Método de pago</span>
            <span>Tarjeta de débito</span>
          </div>
          <div className="flex justify-between">
            <span>Próximo pago</span>
            <span>22 jun 2026</span>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-zinc-900 mb-3">Centros médicos afiliados</h2>
      <div className="space-y-3">
        {medicalCenters.map((center) => (
          <div key={center.name} className="bg-white rounded-xl border border-zinc-100 p-4">
            <h3 className="font-medium text-zinc-900 text-sm">{center.name}</h3>
            <p className="text-xs text-zinc-400 mt-1">{center.address}</p>
            <p className="text-xs text-brand-blue mt-1">{center.phone}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
